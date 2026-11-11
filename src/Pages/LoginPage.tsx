import { useEffect, type InputHTMLAttributes, type ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { clearAuthError, login } from '@/Redux/authSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { RoutePath } from '@/types/Enums/routes'
import { loginSchema } from '@/Validations/loginSchema'

export function LoginPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const status = useAppSelector((state) => state.auth.status)
  const submitting = status === RequestStatus.Loading

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  if (token) return <Navigate to={RoutePath.Dashboard} replace />

  return (
    <Screen>
      <Blob $corner="top" aria-hidden="true" />
      <Blob $corner="bottom" aria-hidden="true" />
      <Dots aria-hidden="true" />
      <Card>
        <Brand>
          <Word>NOVA</Word>
          <BagIcon />
        </Brand>
        <Tagline>{text.brandSubtitle}</Tagline>
        {status === RequestStatus.Error ? <Fail>{text.login.failed}</Fail> : null}
        <Formik
          initialValues={{ username: '', password: '' }}
          validationSchema={loginSchema(text.validation)}
          onSubmit={(values) => {
            void dispatch(login(values))
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur }) => (
            <Form>
              <Fields>
                <LoginField
                  name="username"
                  autoComplete="username"
                  placeholder={text.login.username}
                  aria-label={text.login.username}
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username ? errors.username : undefined}
                  icon={<UserIcon />}
                />
                <LoginField
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  placeholder={text.login.password}
                  aria-label={text.login.password}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : undefined}
                  icon={<LockIcon />}
                />
                <Submit type="submit" disabled={submitting}>
                  {submitting ? text.login.submitting : text.login.submit}
                </Submit>
              </Fields>
            </Form>
          )}
        </Formik>
        <Forgot>{text.login.forgot}</Forgot>
      </Card>
    </Screen>
  )
}

type LoginFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  error?: string
  icon: ReactNode
}

function LoginField({ error, icon, ...props }: LoginFieldProps) {
  return (
    <Field>
      <Control>
        <Input $invalid={Boolean(error)} {...props} />
        <IconSlot>{icon}</IconSlot>
      </Control>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </Field>
  )
}

function BagIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 36 36" aria-hidden="true">
      <path d="M8.5 14.2h19l-1.7 13.4a2.2 2.2 0 0 1-2.2 1.9H12.4a2.2 2.2 0 0 1-2.2-1.9L8.5 14.2z" fill="#F47B20" />
      <path
        d="M14 14.2v-1.4a4 4 0 0 1 8 0v1.4"
        fill="none"
        stroke="#F47B20"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="8" r="3.1" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M6.2 18.2c.8-2.6 3-4 5.8-4s5 1.4 5.8 4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function LockIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="10.5" width="12" height="8.5" rx="2" fill="none" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8.5 10.5V8.2a3.5 3.5 0 0 1 7 0v2.3" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background: #0c1c3f;
  position: relative;
  overflow: hidden;
`

const Blob = styled.span<{ $corner: 'top' | 'bottom' }>`
  position: absolute;
  border-radius: 50%;
  background: #f47b20;
  pointer-events: none;

  ${({ $corner }) =>
    $corner === 'top'
      ? `
    width: 240px;
    height: 240px;
    top: -90px;
    right: -70px;
  `
      : `
    width: 280px;
    height: 280px;
    bottom: -120px;
    left: -90px;
  `}
`

const Dots = styled.span`
  position: absolute;
  width: 180px;
  height: 90px;
  bottom: 36px;
  left: 50%;
  transform: translateX(-58%);
  background-image: radial-gradient(rgba(255, 255, 255, 0.28) 1.1px, transparent 1.2px);
  background-size: 12px 12px;
  pointer-events: none;
`

const Card = styled.section`
  position: relative;
  z-index: 1;
  width: min(400px, 100%);
  background: #ffffff;
  border-radius: 28px;
  padding: 36px 28px 26px;
  box-shadow: 0 24px 60px rgba(5, 16, 40, 0.28);
  text-align: center;
`

const Brand = styled.div`
  display: flex;
  direction: ltr;
  align-items: center;
  justify-content: center;
  gap: 8px;
`

const Word = styled.span`
  color: #14284d;
  font-size: 34px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1;
`

const Tagline = styled.p`
  margin: 12px 0 26px;
  color: #1b2b4b;
  font-size: 18px;
  font-weight: 700;
`

const Fields = styled.div`
  display: grid;
  gap: 14px;
`

const Field = styled.label`
  display: grid;
  gap: 6px;
  text-align: start;
`

const Control = styled.span`
  position: relative;
  display: block;
`

const Input = styled.input<{ $invalid: boolean }>`
  width: 100%;
  height: 52px;
  border-radius: 12px;
  border: 1px solid ${({ $invalid }) => ($invalid ? '#d92d20' : '#e6ebf2')};
  background: #ffffff;
  color: #14284d;
  padding-inline: 44px 14px;
  font-size: 15px;

  &::placeholder {
    color: #9aa6b8;
  }

  &:focus-visible {
    outline: 2px solid #2f7cf6;
    outline-offset: 1px;
  }
`

const IconSlot = styled.span`
  position: absolute;
  inset-inline-start: 14px;
  top: 50%;
  transform: translateY(-50%);
  display: grid;
  color: #8e9aaf;
  pointer-events: none;
`

const ErrorText = styled.small`
  color: #d92d20;
  font-size: 12px;
`

const Submit = styled.button`
  height: 50px;
  margin-top: 4px;
  border: 0;
  border-radius: 12px;
  background: #2f7cf6;
  color: #ffffff;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: #1f6adf;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }

  &:focus-visible {
    outline: 2px solid #14284d;
    outline-offset: 2px;
  }
`

const Forgot = styled.p`
  margin: 16px 0 4px;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 500;
`

const Fail = styled.div`
  margin: -8px 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fef3f2;
  color: #b42318;
  font-size: 14px;
  text-align: start;
`

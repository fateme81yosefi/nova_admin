import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { LogoMark } from '@/assets/Icons/LogoMark'
import { useDictionary } from '@/Dictionary/useDictionary'
import { clearAuthError, login } from '@/Redux/authSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { setLanguage, setTheme } from '@/Redux/uiSlice'
import { Button } from '@/Shared/Button'
import { TextField } from '@/Shared/fields'
import { Language } from '@/types/Enums/language'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { RoutePath } from '@/types/Enums/routes'
import { ThemeMode } from '@/types/Enums/theme'
import { loginSchema } from '@/Validations/loginSchema'

export function LoginPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const token = useAppSelector((state) => state.auth.token)
  const status = useAppSelector((state) => state.auth.status)
  const theme = useAppSelector((state) => state.ui.theme)
  const language = useAppSelector((state) => state.ui.language)
  const submitting = status === RequestStatus.Loading

  useEffect(() => {
    dispatch(clearAuthError())
  }, [dispatch])

  if (token) return <Navigate to={RoutePath.Dashboard} replace />

  return (
    <Screen>
      <Card>
        <Tools>
          <button type="button" onClick={() => dispatch(setLanguage(language === Language.Fa ? Language.En : Language.Fa))}>
            {language === Language.Fa ? text.language.en : text.language.fa}
          </button>
          <button
            type="button"
            onClick={() => dispatch(setTheme(theme === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light))}
          >
            {theme === ThemeMode.Light ? text.theme.toDark : text.theme.toLight}
          </button>
        </Tools>
        <LogoMark />
        <h1>{text.login.title}</h1>
        <p>{text.login.subtitle}</p>
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
                <TextField
                  name="username"
                  autoComplete="username"
                  label={text.login.username}
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username ? errors.username : undefined}
                />
                <TextField
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  label={text.login.password}
                  value={values.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.password ? errors.password : undefined}
                />
                <Button type="submit" disabled={submitting}>
                  {submitting ? text.login.submitting : text.login.submit}
                </Button>
              </Fields>
            </Form>
          )}
        </Formik>
        <Hint>{text.login.hint}</Hint>
      </Card>
    </Screen>
  )
}

const Screen = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
  background:
    radial-gradient(circle at top left, rgba(242, 106, 27, 0.18), transparent 26%),
    ${({ theme }) => theme.bg};
`

const Card = styled.section`
  width: min(440px, 100%);
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 22px;
  padding: 28px 26px 22px;
  box-shadow: ${({ theme }) => theme.shadow};

  h1 {
    margin: 14px 0 6px;
    font-size: 28px;
  }

  p {
    margin: 0 0 16px;
    color: ${({ theme }) => theme.muted};
  }
`

const Tools = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  margin-bottom: 8px;

  button {
    border: 0;
    background: transparent;
    color: ${({ theme }) => theme.muted};
    cursor: pointer;
    font-weight: 700;
  }
`

const Fields = styled.div`
  display: grid;
  gap: 12px;
`

const Fail = styled.div`
  margin-bottom: 12px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};
  font-size: 14px;
`

const Hint = styled.small`
  display: block;
  margin-top: 14px;
  color: ${({ theme }) => theme.muted};
  line-height: 1.7;
`

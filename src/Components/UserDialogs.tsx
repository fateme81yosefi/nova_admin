import { useEffect } from 'react'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { saveUser } from '@/Redux/usersSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { Button } from '@/Shared/Button'
import { TextField } from '@/Shared/fields'
import { Language } from '@/types/Enums/language'
import type { User } from '@/types/user'
import { localizeDigits } from '@/Utils/localizeDigits'
import { userEditSchema } from '@/Validations/userSchema'

type ViewProps = {
  user: User
  onClose: () => void
}

export function UserView({ user, onClose }: ViewProps) {
  const text = useDictionary()
  const language = useAppSelector((state) => state.ui.language)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Overlay onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="user-view-title" onClick={(event) => event.stopPropagation()}>
        <h2 id="user-view-title">{fullName(user)}</h2>
        <Meta>
          <Badge>{text.users.statusActive}</Badge>
          <span>{user.username}</span>
        </Meta>
        <Facts>
          <div>
            <dt>{text.users.email}</dt>
            <dd>{user.email}</dd>
          </div>
          <div>
            <dt>{text.users.phone}</dt>
            <dd>{localizeDigits(user.phone, language)}</dd>
          </div>
          <div>
            <dt>{text.users.address}</dt>
            <dd>{addressLine(user, language) || '—'}</dd>
          </div>
        </Facts>
        <Actions>
          <Button variant="ghost" onClick={onClose} autoFocus>
            {text.common.close}
          </Button>
        </Actions>
      </Dialog>
    </Overlay>
  )
}

type EditProps = {
  user: User
  onClose: () => void
}

export function UserEditor({ user, onClose }: EditProps) {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const saveError = useAppSelector((state) => state.users.saveError)

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <Overlay onClick={onClose}>
      <Dialog role="dialog" aria-modal="true" aria-labelledby="user-edit-title" onClick={(event) => event.stopPropagation()}>
        <h2 id="user-edit-title">{text.users.editTitle}</h2>
        {saveError ? <Fail>{saveError}</Fail> : null}
        <Formik
          initialValues={{
            firstname: user.name.firstname,
            lastname: user.name.lastname,
            username: user.username,
            email: user.email,
            phone: user.phone,
          }}
          validationSchema={userEditSchema(text.validation)}
          enableReinitialize
          onSubmit={async (values, helpers) => {
            const result = await dispatch(
              saveUser({
                id: user.id,
                local: user.local,
                payload: {
                  firstname: values.firstname.trim(),
                  lastname: values.lastname.trim(),
                  username: values.username.trim(),
                  email: values.email.trim(),
                  phone: values.phone.trim(),
                },
              }),
            )
            helpers.setSubmitting(false)
            if (saveUser.fulfilled.match(result)) onClose()
          }}
        >
          {({ values, errors, touched, handleChange, handleBlur, isSubmitting }) => (
            <Form>
              <Grid>
                <TextField
                  name="firstname"
                  label={text.userForm.firstname}
                  value={values.firstname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.firstname ? errors.firstname : undefined}
                />
                <TextField
                  name="lastname"
                  label={text.userForm.lastname}
                  value={values.lastname}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.lastname ? errors.lastname : undefined}
                />
                <TextField
                  name="username"
                  label={text.userForm.username}
                  value={values.username}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.username ? errors.username : undefined}
                />
                <TextField
                  name="email"
                  label={text.userForm.email}
                  value={values.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  error={touched.email ? errors.email : undefined}
                />
                <Wide>
                  <TextField
                    name="phone"
                    label={text.userForm.phone}
                    value={values.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    error={touched.phone ? errors.phone : undefined}
                  />
                </Wide>
              </Grid>
              <Actions>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? text.userForm.submitting : text.common.save}
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  {text.common.cancel}
                </Button>
              </Actions>
            </Form>
          )}
        </Formik>
      </Dialog>
    </Overlay>
  )
}

function fullName(user: User) {
  return `${user.name.firstname} ${user.name.lastname}`.trim()
}

function addressLine(user: User, language: Language) {
  if (!user.address) return ''
  const street = [user.address.number, user.address.street].filter((part) => part !== null && part !== '').join(' ')
  const line = [street, user.address.city, user.address.zipcode].filter(Boolean).join(language === Language.Fa ? '، ' : ', ')
  return localizeDigits(line, language)
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 40;
  background: rgba(9, 15, 26, 0.55);
  display: grid;
  place-items: center;
  padding: 20px;
`

const Dialog = styled.div`
  width: min(640px, 100%);
  max-height: min(86vh, 820px);
  overflow: auto;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  border-radius: 20px;
  padding: 22px;
  box-shadow: ${({ theme }) => theme.shadow};

  h2 {
    margin: 0;
    font-size: 20px;
  }
`

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  color: ${({ theme }) => theme.muted};
`

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: ${({ theme }) => theme.successSoft};
  color: ${({ theme }) => theme.success};
  font-size: 13px;
  font-weight: 700;
`

const Facts = styled.dl`
  display: grid;
  gap: 12px;
  margin: 18px 0 0;

  div {
    display: grid;
    gap: 4px;
  }

  dt {
    color: ${({ theme }) => theme.muted};
    font-size: 13px;
  }

  dd {
    margin: 0;
    font-weight: 700;
  }
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
  margin-top: 16px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const Wide = styled.div`
  grid-column: 1 / -1;
`

const Actions = styled.div`
  display: flex;
  gap: 8px;
  margin-top: 16px;
`

const Fail = styled.p`
  margin: 12px 0 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};
`

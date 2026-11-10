import { useState } from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import { Form, Formik } from 'formik'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { addUser } from '@/Redux/usersSlice'
import { Button } from '@/Shared/Button'
import { TextField } from '@/Shared/fields'
import { RoutePath } from '@/types/Enums/routes'
import { userSchema, type UserFormValues } from '@/Validations/userSchema'

const emptyValues: UserFormValues = {
  firstname: '',
  lastname: '',
  username: '',
  email: '',
  password: '',
  phone: '',
}

export function UserForm() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const saving = useAppSelector((state) => state.users.saving)
  const saveError = useAppSelector((state) => state.users.saveError)
  const [done, setDone] = useState(false)

  return (
    <Card>
      {done ? <Success>{text.userForm.success}</Success> : null}
      {saveError ? (
        <Fail>
          {text.common.requestFailed}
          <small>{saveError}</small>
        </Fail>
      ) : null}
      <Formik
        initialValues={emptyValues}
        validationSchema={userSchema(text.validation)}
        onSubmit={async (values, helpers) => {
          const result = await dispatch(
            addUser({
              firstname: values.firstname.trim(),
              lastname: values.lastname.trim(),
              username: values.username.trim(),
              email: values.email.trim(),
              password: values.password,
              phone: values.phone.trim(),
            }),
          )
          if (addUser.fulfilled.match(result)) {
            helpers.resetForm()
            setDone(true)
          } else {
            setDone(false)
          }
          helpers.setSubmitting(false)
        }}
      >
        {({ values, errors, touched, handleChange, handleBlur }) => (
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
                type="email"
                label={text.userForm.email}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email ? errors.email : undefined}
              />
              <TextField
                name="password"
                type="password"
                autoComplete="new-password"
                label={text.userForm.password}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.password ? errors.password : undefined}
              />
              <TextField
                name="phone"
                label={text.userForm.phone}
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone ? errors.phone : undefined}
              />
            </Grid>
            <Actions>
              <Button type="submit" disabled={saving}>
                {saving ? text.userForm.submitting : text.userForm.submit}
              </Button>
              <Back to={RoutePath.Users}>{text.userForm.back}</Back>
            </Actions>
          </Form>
        )}
      </Formik>
    </Card>
  )
}

const Card = styled.section`
  background: ${({ theme }) => theme.surface};
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 18px;
  padding: 22px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 16px;
`

const Success = styled.p`
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.successSoft};
  color: ${({ theme }) => theme.success};
`

const Fail = styled.p`
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};

  small {
    display: block;
    margin-top: 4px;
  }
`

const Back = styled(Link)`
  height: 42px;
  display: inline-flex;
  align-items: center;
  padding: 0 12px;
  color: ${({ theme }) => theme.muted};
`

import { useEffect } from 'react'
import { UserForm } from '@/Components/UserForm'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch } from '@/Redux/hooks'
import { clearUserSaveError } from '@/Redux/usersSlice'
import { PageHeader } from '@/Shared/PageHeader'

export function CreateUserPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(clearUserSaveError())
  }, [dispatch])

  return (
    <section>
      <PageHeader title={text.userForm.title} subtitle={text.userForm.subtitle} />
      <UserForm />
    </section>
  )
}

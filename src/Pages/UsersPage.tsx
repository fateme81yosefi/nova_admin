import { useEffect, useMemo, useState } from 'react'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { loadUsers } from '@/Redux/usersSlice'
import { ButtonLink } from '@/Shared/Button'
import { PageHeader } from '@/Shared/PageHeader'
import { SearchBox } from '@/Shared/SearchBox'
import { EmptyState, ErrorState, LoadingState } from '@/Shared/StateView'
import { Table, TableWrap } from '@/Shared/table'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { RoutePath } from '@/types/Enums/routes'
import type { User } from '@/types/user'

export function UsersPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const { items, status, error } = useAppSelector((state) => state.users)
  const [query, setQuery] = useState('')

  useEffect(() => {
    void dispatch(loadUsers())
  }, [dispatch])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((user) => {
      const haystack = [fullName(user), user.username, user.email, user.phone].join(' ').toLowerCase()
      return haystack.includes(needle)
    })
  }, [items, query])

  return (
    <section>
      <PageHeader
        title={text.users.title}
        subtitle={text.users.subtitle}
        action={<ButtonLink to={RoutePath.CreateUser}>{text.users.create}</ButtonLink>}
      />
      <SearchBox value={query} placeholder={text.users.search} onChange={setQuery} />
      <div style={{ height: 14 }} />
      {status === RequestStatus.Error ? (
        <ErrorState title={error || text.common.errorTitle} actionLabel={text.common.retry} onAction={() => dispatch(loadUsers())} />
      ) : null}
      {status === RequestStatus.Idle || status === RequestStatus.Loading ? <LoadingState title={text.common.loading} /> : null}
      {status === RequestStatus.Success && items.length === 0 ? <EmptyState title={text.users.empty} /> : null}
      {status === RequestStatus.Success && items.length > 0 && visible.length === 0 ? <EmptyState title={text.common.noResult} /> : null}
      {status === RequestStatus.Success && visible.length > 0 ? (
        <TableWrap>
          <Table>
            <thead>
              <tr>
                <th>{text.users.name}</th>
                <th>{text.users.username}</th>
                <th>{text.users.email}</th>
                <th>{text.users.phone}</th>
              </tr>
            </thead>
            <tbody>
              {visible.map((user) => (
                <tr key={user.id}>
                  <td>{fullName(user)}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </TableWrap>
      ) : null}
    </section>
  )
}

function fullName(user: User) {
  return `${user.name.firstname} ${user.name.lastname}`.trim()
}

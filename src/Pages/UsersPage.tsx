import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { EyeIcon, PencilIcon, TrashIcon } from '@/assets/Icons/ui'
import { UserEditor, UserView } from '@/Components/UserDialogs'
import { useDictionary } from '@/Dictionary/useDictionary'
import { ConfirmModal } from '@/Modals/ConfirmModal'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { loadUsers, removeUser } from '@/Redux/usersSlice'
import { ListToolbar } from '@/Shared/ListToolbar'
import { PAGE_SIZE, Pagination } from '@/Shared/Pagination'
import { EmptyState, ErrorState, LoadingState } from '@/Shared/StateView'
import { Panel, Table, TableWrap } from '@/Shared/table'
import { RequestStatus } from '@/types/Enums/requestStatus'
import { RoutePath } from '@/types/Enums/routes'
import type { User } from '@/types/user'
import { localizeDigits } from '@/Utils/localizeDigits'

export function UsersPage() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const { items, status, error, saveError } = useAppSelector((state) => state.users)
  const language = useAppSelector((state) => state.ui.language)
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<User | null>(null)
  const [editing, setEditing] = useState<User | null>(null)
  const [removing, setRemoving] = useState<User | null>(null)

  useEffect(() => {
    void dispatch(loadUsers())
  }, [dispatch])

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase()
    if (!needle) return items
    return items.filter((user) => {
      const haystack = [fullName(user), user.username, user.email, user.phone, user.address?.city, user.address?.street]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(needle)
    })
  }, [items, query])

  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const rows = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  async function confirmRemove() {
    if (!removing) return
    const result = await dispatch(removeUser({ id: removing.id, local: removing.local }))
    if (removeUser.fulfilled.match(result)) setRemoving(null)
  }

  return (
    <section>
      <ListToolbar
        to={RoutePath.CreateUser}
        action={text.users.create}
        placeholder={text.users.search}
        query={query}
        onQuery={(value) => {
          setQuery(value)
          setPage(1)
        }}
      />
      {saveError && !editing ? <Banner>{saveError}</Banner> : null}
      {status === RequestStatus.Error ? (
        <ErrorState title={error || text.common.errorTitle} actionLabel={text.common.retry} onAction={() => dispatch(loadUsers())} />
      ) : null}
      {status === RequestStatus.Idle || status === RequestStatus.Loading ? <LoadingState title={text.common.loading} /> : null}
      {status === RequestStatus.Success && items.length === 0 ? <EmptyState title={text.users.empty} /> : null}
      {status === RequestStatus.Success && items.length > 0 && visible.length === 0 ? <EmptyState title={text.common.noResult} /> : null}
      {status === RequestStatus.Success && visible.length > 0 ? (
        <Panel>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <th>{text.users.name}</th>
                  <th>{text.users.username}</th>
                  <th>{text.users.email}</th>
                  <th>{text.users.phone}</th>
                  <th>{text.users.city}</th>
                  <th>{text.users.status}</th>
                  <th>{text.users.actions}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((user) => (
                  <tr key={user.id}>
                    <td>{fullName(user)}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{localizeDigits(user.phone, language)}</td>
                    <td>{user.address?.city || '—'}</td>
                    <td>
                      <Badge>{text.users.statusActive}</Badge>
                    </td>
                    <td>
                      <Actions>
                        <IconButton type="button" $tone="edit" aria-label={text.users.edit} onClick={() => setEditing(user)}>
                          <PencilIcon />
                        </IconButton>
                        <IconButton type="button" $tone="delete" aria-label={text.users.remove} onClick={() => setRemoving(user)}>
                          <TrashIcon />
                        </IconButton>
                        <IconButton type="button" $tone="view" aria-label={text.users.view} onClick={() => setViewing(user)}>
                          <EyeIcon />
                        </IconButton>
                      </Actions>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </TableWrap>
          <Pagination page={currentPage} pageCount={pageCount} total={visible.length} onPageChange={setPage} />
        </Panel>
      ) : null}
      {viewing ? <UserView user={viewing} onClose={() => setViewing(null)} /> : null}
      {editing ? <UserEditor user={editing} onClose={() => setEditing(null)} /> : null}
      {removing ? (
        <ConfirmModal
          title={text.users.deleteTitle}
          text={text.users.deleteText}
          confirmLabel={text.users.remove}
          cancelLabel={text.common.cancel}
          onConfirm={() => void confirmRemove()}
          onClose={() => setRemoving(null)}
        />
      ) : null}
    </section>
  )
}

function fullName(user: User) {
  return `${user.name.firstname} ${user.name.lastname}`.trim()
}

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

const Actions = styled.div`
  direction: ltr;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const IconButton = styled.button<{ $tone: 'edit' | 'delete' | 'view' }>`
  width: 34px;
  height: 34px;
  border: 0;
  border-radius: 10px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: ${({ theme }) => theme.surfaceMuted};
  color: ${({ theme, $tone }) => {
    if ($tone === 'delete') return theme.danger
    if ($tone === 'edit') return theme.accent
    return theme.muted
  }};

  &:hover {
    background: ${({ theme }) => theme.border};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

const Banner = styled.p`
  margin: 0 0 14px;
  padding: 10px 12px;
  border-radius: 12px;
  background: ${({ theme }) => theme.dangerSoft};
  color: ${({ theme }) => theme.danger};
`

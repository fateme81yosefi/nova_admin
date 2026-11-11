import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { Avatar } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { RoutePath } from '@/types/Enums/routes'

export function SidebarAccount() {
  const text = useDictionary()

  return (
    <UserLink to={RoutePath.Settings}>
      <Avatar size={36} />
      <span>{text.account.role}</span>
    </UserLink>
  )
}

const UserLink = styled(NavLink)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: ${({ theme }) => theme.sidebarText};
  font-weight: 600;
  padding: 4px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
    border-radius: 12px;
  }
`

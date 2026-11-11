import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { BoxIcon, GearIcon, HomeIcon, UsersIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { RoutePath } from '@/types/Enums/routes'

const links = [
  { to: RoutePath.Dashboard, label: 'dashboard', icon: HomeIcon },
  { to: RoutePath.Products, label: 'products', icon: BoxIcon },
  { to: RoutePath.Users, label: 'users', icon: UsersIcon },
  { to: RoutePath.Settings, label: 'settings', icon: GearIcon },
] as const

export function SidebarNav() {
  const text = useDictionary()

  return (
    <Nav>
      {links.map((link) => {
        const Icon = link.icon
        return (
          <Item key={link.to} to={link.to} end={link.to === RoutePath.Dashboard}>
            <Icon />
            <span>{text.nav[link.label]}</span>
          </Item>
        )
      })}
    </Nav>
  )
}

const Nav = styled.nav`
  display: grid;
  gap: 6px;
`

const Item = styled(NavLink)`
  height: 48px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 16px;
  border-radius: 12px;
  color: ${({ theme }) => theme.sidebarMuted};
  font-weight: 600;

  &.active {
    background: ${({ theme }) => theme.sidebarActive};
    color: ${({ theme }) => theme.sidebarText};
  }

  &:hover {
    color: ${({ theme }) => theme.sidebarText};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

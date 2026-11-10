import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import { LogoMark } from '@/assets/Icons/LogoMark'
import { useDictionary } from '@/Dictionary/useDictionary'
import { RoutePath } from '@/types/Enums/routes'

const links = [
  { to: RoutePath.Dashboard, label: 'dashboard' },
  { to: RoutePath.Products, label: 'products' },
  { to: RoutePath.Users, label: 'users' },
] as const

export function Sidebar() {
  const text = useDictionary()

  return (
    <Aside>
      <Brand>
        <LogoMark />
        <span>
          <strong>{text.brand}</strong>
          <small>{text.brandSubtitle}</small>
        </span>
      </Brand>
      <Nav>
        {links.map((link) => (
          <Item key={link.to} to={link.to} end={link.to === RoutePath.Dashboard}>
            {text.nav[link.label]}
          </Item>
        ))}
      </Nav>
    </Aside>
  )
}

const Aside = styled.aside`
  background: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.sidebarText};
  min-height: 100vh;
  padding: 22px 16px;
  position: sticky;
  top: 0;
`

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 8px 22px;

  strong {
    display: block;
    letter-spacing: 0.08em;
    font-size: 18px;
  }

  small {
    color: ${({ theme }) => theme.sidebarMuted};
  }
`

const Nav = styled.nav`
  display: grid;
  gap: 6px;
`

const Item = styled(NavLink)`
  height: 44px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-radius: 12px;
  color: ${({ theme }) => theme.sidebarMuted};
  font-weight: 600;

  &.active {
    background: rgba(242, 106, 27, 0.18);
    color: ${({ theme }) => theme.sidebarText};
  }
`

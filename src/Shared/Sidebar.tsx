import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'
import {
  Avatar,
  BagIcon,
  BoxIcon,
  CaretIcon,
  GearIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  UsersIcon,
} from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { setLanguage, setTheme } from '@/Redux/uiSlice'
import { Language } from '@/types/Enums/language'
import { RoutePath } from '@/types/Enums/routes'
import { ThemeMode } from '@/types/Enums/theme'

const links = [
  { to: RoutePath.Dashboard, label: 'dashboard', icon: HomeIcon },
  { to: RoutePath.Products, label: 'products', icon: BoxIcon },
  { to: RoutePath.Users, label: 'users', icon: UsersIcon },
  { to: RoutePath.Settings, label: 'settings', icon: GearIcon },
] as const

type SidebarProps = {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  const text = useDictionary()

  return (
    <Aside $open={open} inert={!open} aria-hidden={!open}>
      <Brand>
        <Word>NOVA</Word>
        <BagIcon />
      </Brand>
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
      <Footer>
        <Controls>
          <LanguageMenu />
          <ThemeSwitch />
        </Controls>
        <UserLink to={RoutePath.Settings}>
          <Avatar size={36} />
          <span>{text.account.role}</span>
        </UserLink>
      </Footer>
    </Aside>
  )
}

function ThemeSwitch() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const mode = useAppSelector((state) => state.ui.theme)

  return (
    <Switch role="group" aria-label={text.theme.toDark}>
      <SwitchButton
        type="button"
        $active={mode === ThemeMode.Dark}
        aria-pressed={mode === ThemeMode.Dark}
        aria-label={text.theme.toDark}
        onClick={() => dispatch(setTheme(ThemeMode.Dark))}
      >
        <MoonIcon />
      </SwitchButton>
      <SwitchButton
        type="button"
        $active={mode === ThemeMode.Light}
        aria-pressed={mode === ThemeMode.Light}
        aria-label={text.theme.toLight}
        onClick={() => dispatch(setTheme(ThemeMode.Light))}
      >
        <SunIcon />
      </SwitchButton>
    </Switch>
  )
}

function LanguageMenu() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.ui.language)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = language === Language.Fa ? 'FA' : 'EN'

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  function choose(next: Language) {
    dispatch(setLanguage(next))
    setOpen(false)
  }

  return (
    <Lang ref={ref}>
      <LangButton
        type="button"
        aria-label={text.language.label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {current}
        <CaretIcon />
      </LangButton>
      {open ? (
        <LangList role="menu">
          <LangOption type="button" role="menuitem" $active={language === Language.Fa} onClick={() => choose(Language.Fa)}>
            FA
          </LangOption>
          <LangOption type="button" role="menuitem" $active={language === Language.En} onClick={() => choose(Language.En)}>
            EN
          </LangOption>
        </LangList>
      ) : null}
    </Lang>
  )
}

const Aside = styled.aside<{ $open: boolean }>`
  direction: ${({ theme }) => theme.direction};
  background: ${({ theme }) => theme.sidebar};
  color: ${({ theme }) => theme.sidebarText};
  width: ${({ $open }) => ($open ? '252px' : '0px')};
  min-width: 0;
  height: calc(100vh - 28px);
  position: sticky;
  top: 14px;
  display: flex;
  flex-direction: column;
  padding: ${({ $open }) => ($open ? '26px 14px 18px' : '0')};
  overflow: hidden;

  @media (max-width: 900px) {
    position: fixed;
    z-index: 30;
    top: 14px;
    bottom: 14px;
    left: 14px;
    width: 252px;
    height: auto;
    padding: 26px 14px 18px;
    overflow: visible;
    border-radius: 24px;
    box-shadow: ${({ theme }) => theme.shadow};
    transform: translateX(${({ $open }) => ($open ? '0' : '-115%')});
    transition: transform 0.2s ease;
  }
`

const Brand = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding-bottom: 28px;
`

const Word = styled.strong`
  font-size: 28px;
  letter-spacing: 0.04em;
  line-height: 1;
`

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

const Footer = styled.div`
  margin-top: auto;
  display: grid;
  gap: 22px;
  padding-top: 18px;
`

const Controls = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 6px;
`

const Switch = styled.div`
  direction: ltr;
  display: flex;
  align-items: center;
  gap: 2px;
  padding: 4px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
`

const SwitchButton = styled.button<{ $active: boolean }>`
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'rgba(255, 255, 255, 0.2)' : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.sidebarText : theme.sidebarMuted)};

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

const Lang = styled.div`
  position: relative;
`

const LangButton = styled.button`
  direction: ltr;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.sidebarText};
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  letter-spacing: 0.04em;
  cursor: pointer;
  padding: 6px;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
    border-radius: 8px;
  }
`

const LangList = styled.div`
  position: absolute;
  bottom: calc(100% + 8px);
  inset-inline-start: 0;
  min-width: 92px;
  padding: 6px;
  border-radius: 12px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  box-shadow: ${({ theme }) => theme.shadow};
  z-index: 2;
`

const LangOption = styled.button<{ $active: boolean }>`
  width: 100%;
  height: 34px;
  border: 0;
  border-radius: 8px;
  background: ${({ theme, $active }) => ($active ? theme.surfaceMuted : 'transparent')};
  color: ${({ theme }) => theme.text};
  font-weight: 700;
  cursor: pointer;
  text-align: start;
  padding: 0 10px;

  &:hover {
    background: ${({ theme }) => theme.surfaceMuted};
  }
`

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

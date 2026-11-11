import styled from 'styled-components'
import { BagIcon } from '@/assets/Icons/ui'
import { LanguageMenu } from './sidebar/LanguageMenu'
import { SidebarAccount } from './sidebar/SidebarAccount'
import { SidebarNav } from './sidebar/SidebarNav'
import { ThemeSwitch } from './sidebar/ThemeSwitch'

type SidebarProps = {
  open: boolean
}

export function Sidebar({ open }: SidebarProps) {
  return (
    <Aside $open={open} inert={!open} aria-hidden={!open}>
      <Brand>
        <Word>NOVA</Word>
        <BagIcon />
      </Brand>
      <SidebarNav />
      <Footer>
        <Controls>
          <LanguageMenu />
          <ThemeSwitch />
        </Controls>
        <SidebarAccount />
      </Footer>
    </Aside>
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

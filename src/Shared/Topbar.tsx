import styled from 'styled-components'
import { Avatar, MenuIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { IconButton } from './topbar/IconButton'
import { NotificationMenu } from './topbar/NotificationMenu'

type TopbarProps = {
  menuOpen: boolean
  onMenu: () => void
}

export function Topbar({ menuOpen, onMenu }: TopbarProps) {
  const text = useDictionary()

  return (
    <Bar>
      <Tools>
        <IconButton type="button" aria-label={text.common.menu} aria-expanded={menuOpen} onClick={onMenu}>
          <MenuIcon />
        </IconButton>
        <NotificationMenu />
      </Tools>
      <Hello>
        <span>{text.account.welcome}</span>
        <Avatar />
      </Hello>
    </Bar>
  )
}

const Bar = styled.header`
  direction: ltr;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 22px;
  background: ${({ theme }) => theme.surface};
`

const Tools = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Hello = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 700;
  color: ${({ theme }) => theme.text};
`

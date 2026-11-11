import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { Avatar, BellIcon, MenuIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'

type TopbarProps = {
  menuOpen: boolean
  onMenu: () => void
}

export function Topbar({ menuOpen, onMenu }: TopbarProps) {
  const text = useDictionary()
  const [notesOpen, setNotesOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const notesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!notesOpen) return
    function onPointer(event: MouseEvent) {
      if (!notesRef.current?.contains(event.target as Node)) setNotesOpen(false)
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setNotesOpen(false)
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [notesOpen])

  function toggleNotes() {
    setNotesOpen((value) => !value)
    setUnread(false)
  }

  return (
    <Bar>
      <Tools>
        <IconButton type="button" aria-label={text.common.menu} aria-expanded={menuOpen} onClick={onMenu}>
          <MenuIcon />
        </IconButton>
        <Notes ref={notesRef}>
          <IconButton type="button" aria-label={text.notifications.label} aria-expanded={notesOpen} onClick={toggleNotes}>
            <BellIcon />
            {unread ? <Dot /> : null}
          </IconButton>
          {notesOpen ? (
            <NoteList>
              <NoteTitle>{text.notifications.label}</NoteTitle>
              <p>{text.notifications.welcome}</p>
            </NoteList>
          ) : null}
        </Notes>
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

const IconButton = styled.button`
  position: relative;
  width: 40px;
  height: 40px;
  border: 0;
  border-radius: 12px;
  background: transparent;
  color: ${({ theme }) => theme.text};
  display: grid;
  place-items: center;
  cursor: pointer;

  &:hover {
    background: ${({ theme }) => theme.surfaceMuted};
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.accent};
    outline-offset: 2px;
  }
`

const Dot = styled.span`
  position: absolute;
  top: 8px;
  right: 9px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${({ theme }) => theme.danger};
  box-shadow: 0 0 0 2px ${({ theme }) => theme.surface};
`

const Notes = styled.div`
  position: relative;
`

const NoteList = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  width: 260px;
  padding: 14px;
  border-radius: 14px;
  background: ${({ theme }) => theme.surface};
  color: ${({ theme }) => theme.text};
  box-shadow: ${({ theme }) => theme.shadow};
  border: 1px solid ${({ theme }) => theme.border};
  direction: ${({ theme }) => theme.direction};
  text-align: start;
  z-index: 5;

  p {
    margin: 0;
    color: ${({ theme }) => theme.muted};
    line-height: 1.7;
  }
`

const NoteTitle = styled.strong`
  display: block;
  margin-bottom: 6px;
`

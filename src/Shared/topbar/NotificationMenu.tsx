import styled from 'styled-components'
import { BellIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { IconButton } from './IconButton'
import { useNotifications } from './useNotifications'

export function NotificationMenu() {
  const text = useDictionary()
  const notes = useNotifications()

  return (
    <Notes ref={notes.ref}>
      <IconButton type="button" aria-label={text.notifications.label} aria-expanded={notes.open} onClick={notes.toggle}>
        <BellIcon />
        {notes.unread ? <Dot /> : null}
      </IconButton>
      {notes.open ? (
        <NoteList>
          <NoteTitle>{text.notifications.label}</NoteTitle>
          <p>{text.notifications.welcome}</p>
        </NoteList>
      ) : null}
    </Notes>
  )
}

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

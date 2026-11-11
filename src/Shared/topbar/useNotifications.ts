import { useRef, useState } from 'react'
import { useDismissible } from '../useDismissible'

export function useNotifications() {
  const [open, setOpen] = useState(false)
  const [unread, setUnread] = useState(true)
  const ref = useRef<HTMLDivElement>(null)
  useDismissible(open, ref, () => setOpen(false))

  function toggle() {
    setOpen((value) => !value)
    setUnread(false)
  }

  return { open, unread, ref, toggle }
}

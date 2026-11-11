import { useEffect, useRef, type RefObject } from 'react'

export function useDismissible(open: boolean, ref: RefObject<HTMLElement | null>, onClose: () => void) {
  const closeRef = useRef(onClose)
  closeRef.current = onClose

  useEffect(() => {
    if (!open) return
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) closeRef.current()
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === 'Escape') closeRef.current()
    }
    document.addEventListener('mousedown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, ref])
}

import { useRef, useState } from 'react'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { setLanguage } from '@/Redux/uiSlice'
import { Language } from '@/types/Enums/language'
import { useDismissible } from '../useDismissible'

export function useLanguageMenu() {
  const dispatch = useAppDispatch()
  const language = useAppSelector((state) => state.ui.language)
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useDismissible(open, ref, () => setOpen(false))

  function choose(next: Language) {
    dispatch(setLanguage(next))
    setOpen(false)
  }

  return {
    language,
    open,
    ref,
    current: language === Language.Fa ? 'FA' : 'EN',
    toggle: () => setOpen((value) => !value),
    choose,
  }
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'
import { useDictionary } from '@/Dictionary/useDictionary'
import { ConfirmModal } from '@/Modals/ConfirmModal'
import { logout } from '@/Redux/authSlice'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { setLanguage, setTheme } from '@/Redux/uiSlice'
import { Button } from '@/Shared/Button'
import { Language } from '@/types/Enums/language'
import { RoutePath } from '@/types/Enums/routes'
import { ThemeMode } from '@/types/Enums/theme'

export function Topbar() {
  const text = useDictionary()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const username = useAppSelector((state) => state.auth.username)
  const theme = useAppSelector((state) => state.ui.theme)
  const language = useAppSelector((state) => state.ui.language)
  const [confirming, setConfirming] = useState(false)

  const themeLabel = theme === ThemeMode.Light ? text.theme.toDark : text.theme.toLight

  function confirmLogout() {
    dispatch(logout())
    setConfirming(false)
    navigate(RoutePath.Login)
  }

  return (
    <Bar>
      <User>{username}</User>
      <Actions>
        <LangGroup aria-label={text.language.label}>
          <LangButton
            type="button"
            $active={language === Language.Fa}
            onClick={() => dispatch(setLanguage(Language.Fa))}
          >
            {text.language.fa}
          </LangButton>
          <LangButton
            type="button"
            $active={language === Language.En}
            onClick={() => dispatch(setLanguage(Language.En))}
          >
            {text.language.en}
          </LangButton>
        </LangGroup>
        <Button
          variant="ghost"
          onClick={() => dispatch(setTheme(theme === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light))}
        >
          {themeLabel}
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(true)}>
          {text.logoutModal.confirm}
        </Button>
      </Actions>
      {confirming ? (
        <ConfirmModal
          title={text.logoutModal.title}
          text={text.logoutModal.text}
          confirmLabel={text.logoutModal.confirm}
          cancelLabel={text.logoutModal.cancel}
          onConfirm={confirmLogout}
          onClose={() => setConfirming(false)}
        />
      ) : null}
    </Bar>
  )
}

const Bar = styled.header`
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0 28px;
  background: ${({ theme }) => theme.surface};
  border-bottom: 1px solid ${({ theme }) => theme.border};
`

const User = styled.span`
  font-weight: 700;
`

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const LangGroup = styled.div`
  display: flex;
  padding: 3px;
  border: 1px solid ${({ theme }) => theme.border};
  border-radius: 12px;
`

const LangButton = styled.button<{ $active: boolean }>`
  border: 0;
  background: ${({ theme, $active }) => ($active ? theme.accent : 'transparent')};
  color: ${({ theme, $active }) => ($active ? theme.onAccent : theme.text)};
  border-radius: 9px;
  min-width: 40px;
  height: 32px;
  cursor: pointer;
  font-weight: 700;
`

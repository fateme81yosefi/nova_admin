import styled from 'styled-components'
import { MoonIcon, SunIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { useAppDispatch, useAppSelector } from '@/Redux/hooks'
import { setTheme } from '@/Redux/uiSlice'
import { ThemeMode } from '@/types/Enums/theme'

export function ThemeSwitch() {
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

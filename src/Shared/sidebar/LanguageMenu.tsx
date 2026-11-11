import styled from 'styled-components'
import { CaretIcon } from '@/assets/Icons/ui'
import { useDictionary } from '@/Dictionary/useDictionary'
import { Language } from '@/types/Enums/language'
import { useLanguageMenu } from './useLanguageMenu'

export function LanguageMenu() {
  const text = useDictionary()
  const menu = useLanguageMenu()

  return (
    <Lang ref={menu.ref}>
      <LangButton
        type="button"
        aria-label={text.language.label}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        onClick={menu.toggle}
      >
        {menu.current}
        <CaretIcon />
      </LangButton>
      {menu.open ? (
        <LangList role="menu">
          <LangOption type="button" role="menuitem" $active={menu.language === Language.Fa} onClick={() => menu.choose(Language.Fa)}>
            FA
          </LangOption>
          <LangOption type="button" role="menuitem" $active={menu.language === Language.En} onClick={() => menu.choose(Language.En)}>
            EN
          </LangOption>
        </LangList>
      ) : null}
    </Lang>
  )
}

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

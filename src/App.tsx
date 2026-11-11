import { useEffect, type ReactNode } from 'react'
import { ThemeProvider } from 'styled-components'
import { useAppSelector } from '@/Redux/hooks'
import { GlobalStyle } from '@/styles/GlobalStyle'
import { darkTheme, lightTheme } from '@/styles/theme'
import { Language } from '@/types/Enums/language'
import { ThemeMode } from '@/types/Enums/theme'

export function AppProviders({ children }: { children: ReactNode }) {
  const mode = useAppSelector((state) => state.ui.theme)
  const language = useAppSelector((state) => state.ui.language)
  const colors = mode === ThemeMode.Dark ? darkTheme : lightTheme
  const theme = {
    ...colors,
    direction: language === Language.Fa ? ('rtl' as const) : ('ltr' as const),
  }

  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = language === Language.Fa ? 'rtl' : 'ltr'
  }, [language])

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      {children}
    </ThemeProvider>
  )
}

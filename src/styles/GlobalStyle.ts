import { createGlobalStyle } from 'styled-components'
import { ThemeMode } from '@/types/Enums/theme'

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  html, body, #root {
    min-height: 100%;
  }

  body {
    margin: 0;
    font-family: Vazirmatn, sans-serif;
    background: ${({ theme }) => theme.bg};
    color: ${({ theme }) => theme.text};
    color-scheme: ${({ theme }) => (theme.mode === ThemeMode.Dark ? 'dark' : 'light')};
  }

  button, input, select, textarea {
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  img {
    max-width: 100%;
  }
`

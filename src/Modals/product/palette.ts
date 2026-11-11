import { ThemeMode } from '@/types/Enums/theme'
import type { AppTheme } from '@/styles/theme'

export function palette(theme: AppTheme) {
  const dark = theme.mode === ThemeMode.Dark
  return {
    text: dark ? theme.text : '#1B2559',
    muted: dark ? theme.muted : '#98A2B3',
    line: dark ? theme.border : '#E6EAF2',
    card: dark ? theme.surface : '#FFFFFF',
    well: dark ? theme.surfaceMuted : '#F4F6FB',
    field: dark ? theme.input : '#FFFFFF',
    danger: dark ? theme.danger : '#D92D20',
    star: '#F04438',
    blue: theme.accent,
    blueHover: theme.accentHover,
  }
}

export const fieldControl = `
  width: 100%;
  height: 46px;
  border-radius: 12px;
  padding: 0 14px;
  font-size: 14px;
`

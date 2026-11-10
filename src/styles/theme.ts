import { ThemeMode } from '@/types/Enums/theme'

export const lightTheme = {
  mode: ThemeMode.Light,
  bg: '#F3F0EA',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F4EF',
  text: '#142033',
  muted: '#66758A',
  border: '#E4DDD2',
  accent: '#F26A1B',
  accentHover: '#DB560E',
  onAccent: '#FFFFFF',
  danger: '#B42318',
  dangerSoft: '#FEF3F2',
  success: '#067647',
  successSoft: '#ECFDF3',
  shadow: '0 16px 40px rgba(16, 28, 51, 0.08)',
  sidebar: '#101C33',
  sidebarText: '#F4F7FB',
  sidebarMuted: '#9AABC2',
  input: '#FFFFFF',
}

export type AppTheme = typeof lightTheme

export const darkTheme: AppTheme = {
  mode: ThemeMode.Dark,
  bg: '#0C1422',
  surface: '#162033',
  surfaceMuted: '#1C2940',
  text: '#F4F7FB',
  muted: '#A9B6C9',
  border: '#2C3E5C',
  accent: '#FF7A2F',
  accentHover: '#E86A22',
  onAccent: '#1B120C',
  danger: '#FDA29B',
  dangerSoft: '#3F2222',
  success: '#75E0A7',
  successSoft: '#123226',
  shadow: '0 16px 40px rgba(0, 0, 0, 0.28)',
  sidebar: '#090F1A',
  sidebarText: '#F4F7FB',
  sidebarMuted: '#93A4BB',
  input: '#121C2E',
}

import { ThemeMode } from '@/types/Enums/theme'

export const lightTheme = {
  mode: ThemeMode.Light,
  bg: '#F3F5FB',
  content: '#EEF1F8',
  surface: '#FFFFFF',
  surfaceMuted: '#F7F8FC',
  text: '#1B2B4B',
  muted: '#7B8798',
  border: '#E6EAF2',
  accent: '#2673F7',
  accentHover: '#1C62E4',
  onAccent: '#FFFFFF',
  danger: '#E5484D',
  dangerSoft: '#FEF3F2',
  success: '#2E9B62',
  successSoft: '#E3F6E8',
  shadow: '0 16px 40px rgba(16, 32, 64, 0.08)',
  sidebar: '#172740',
  sidebarActive: '#2159A6',
  sidebarText: '#F4F7FB',
  sidebarMuted: '#C5D0E0',
  input: '#FFFFFF',
}

export type ThemeColors = typeof lightTheme

export type AppTheme = ThemeColors & {
  direction: 'rtl' | 'ltr'
}

export const darkTheme: ThemeColors = {
  mode: ThemeMode.Dark,
  bg: '#090E18',
  content: '#101828',
  surface: '#172033',
  surfaceMuted: '#1C2940',
  text: '#F4F7FB',
  muted: '#A9B6C9',
  border: '#2C3E5C',
  accent: '#3B82F6',
  accentHover: '#2F6FE0',
  onAccent: '#FFFFFF',
  danger: '#FDA29B',
  dangerSoft: '#3F2222',
  success: '#75E0A7',
  successSoft: '#123226',
  shadow: '0 16px 40px rgba(0, 0, 0, 0.28)',
  sidebar: '#0C1424',
  sidebarActive: '#2159A6',
  sidebarText: '#F4F7FB',
  sidebarMuted: '#C5D0E0',
  input: '#121C2E',
}

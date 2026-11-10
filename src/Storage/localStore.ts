import type { Session } from '@/types/auth'
import { Language } from '@/types/Enums/language'
import { StorageKey } from '@/types/Enums/storageKey'
import { ThemeMode } from '@/types/Enums/theme'

function readRaw(key: StorageKey) {
  if (typeof localStorage === 'undefined') return null
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeRaw(key: StorageKey, value: string) {
  try {
    localStorage.setItem(key, value)
  } catch {
    // اگر مرورگر storage را بسته باشد، برنامه نباید بترکد
  }
}

export function readSession(): Session | null {
  const raw = readRaw(StorageKey.Session)
  if (!raw) return null

  try {
    const parsed = JSON.parse(raw) as Partial<Session>
    if (!parsed.token || !parsed.username) return null
    return { token: parsed.token, username: parsed.username }
  } catch {
    return null
  }
}

export function writeSession(session: Session) {
  // توکن را در localStorage می‌گذارم. کوکی HttpOnly بدون بک‌اند خودمان ممکن نیست.
  writeRaw(StorageKey.Session, JSON.stringify(session))
}

export function clearSession() {
  try {
    localStorage.removeItem(StorageKey.Session)
  } catch {
    // نادیده بگیر
  }
}

export function readTheme() {
  const value = readRaw(StorageKey.Theme)
  if (value === ThemeMode.Dark || value === ThemeMode.Light) return value
  return ThemeMode.Light
}

export function writeTheme(theme: ThemeMode) {
  writeRaw(StorageKey.Theme, theme)
}

export function readLanguage() {
  const value = readRaw(StorageKey.Language)
  if (value === Language.Fa || value === Language.En) return value
  return Language.Fa
}

export function writeLanguage(language: Language) {
  writeRaw(StorageKey.Language, language)
}

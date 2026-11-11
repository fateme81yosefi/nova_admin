import type { LoginPayload } from '@/types/auth'

function readCredential(name: 'VITE_AUTH_USERNAME' | 'VITE_AUTH_PASSWORD') {
  const value = import.meta.env[name]
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`${name} is not set`)
  }
  return value
}

export async function loginRequest(payload: LoginPayload) {
  const username = readCredential('VITE_AUTH_USERNAME')
  const password = readCredential('VITE_AUTH_PASSWORD')
  if (payload.username.trim() !== username || payload.password !== password) {
    throw new Error('unauthorized')
  }
  return crypto.randomUUID()
}

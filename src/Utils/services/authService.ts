import type { LoginPayload } from '@/types/auth'
import { api } from '@/Utils/api/axiosInstance'

type LoginResponse = {
  token?: string
}

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse | string>('/auth/login', {
    username: payload.username.trim(),
    password: payload.password,
  })
  const token = typeof data === 'string' ? data.trim() : data.token?.trim()
  if (!token) {
    throw new Error('missing token')
  }
  return token
}

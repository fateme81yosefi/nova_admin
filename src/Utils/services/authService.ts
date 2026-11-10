import type { LoginPayload } from '@/types/auth'
import { api } from '@/Utils/api/axiosInstance'

type LoginResponse = {
  token: string
}

export async function loginRequest(payload: LoginPayload) {
  const { data } = await api.post<LoginResponse>('/auth/login', payload)
  return data.token
}

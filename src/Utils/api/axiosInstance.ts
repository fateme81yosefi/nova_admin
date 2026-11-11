import axios from 'axios'
import { readSession } from '@/Storage/localStore'

function readBaseUrl() {
  const value = import.meta.env.VITE_API_BASE_URL
  if (typeof value !== 'string' || value.length === 0) {
    throw new Error('VITE_API_BASE_URL is not set')
  }
  return value
}

export const api = axios.create({
  baseURL: readBaseUrl(),
  timeout: 15000,
  headers: {
    Accept: 'application/json',
  },
})

type UnauthorizedHandler = () => void

let onUnauthorized: UnauthorizedHandler | null = null

export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler
}

api.interceptors.request.use((config) => {
  const session = readSession()
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

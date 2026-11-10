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

api.interceptors.request.use((config) => {
  const session = readSession()
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`
  }
  return config
})

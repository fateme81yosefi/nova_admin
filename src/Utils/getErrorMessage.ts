import axios from 'axios'

export function getErrorMessage(error: unknown) {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data
    if (typeof data === 'string' && data.trim()) return data
    if (data && typeof data === 'object' && 'message' in data) {
      const message = data.message
      if (typeof message === 'string' && message.trim()) return message
    }
    return error.message
  }

  if (error instanceof Error) return error.message
  return ''
}

export function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isImageSource(value: string) {
  return safeImageUrl(value) !== null
}

export function safeImageUrl(value: string) {
  const trimmed = value.trim()
  if (trimmed.toLowerCase().startsWith('data:image/')) {
    if (trimmed.toLowerCase().startsWith('data:image/svg')) return null
    return trimmed
  }
  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'https:' || url.username || url.password) return null
    return url.href
  } catch {
    return null
  }
}

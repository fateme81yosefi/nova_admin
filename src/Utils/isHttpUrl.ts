export function isHttpUrl(value: string) {
  try {
    const url = new URL(value.trim())
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export function isImageSource(value: string) {
  const trimmed = value.trim()
  return trimmed.startsWith('data:image/') || isHttpUrl(trimmed)
}

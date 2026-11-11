import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

const root = fileURLToPath(new URL('.', import.meta.url))

function apiOrigin(value: string | undefined) {
  if (!value) return ''
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return ''
    return url.origin
  } catch {
    return ''
  }
}

function contentSecurityPolicy(origin: string, dev: boolean) {
  const connect = ["'self'", origin, ...(dev ? ['ws:', 'http://localhost:5173', 'http://127.0.0.1:5173'] : [])].filter(Boolean)
  const script = ["'self'", ...(dev ? ["'unsafe-eval'"] : [])]
  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    `script-src ${script.join(' ')}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: https:",
    "font-src 'self'",
    `connect-src ${connect.join(' ')}`,
  ].join('; ')
}

function securityHeaders(policy: string) {
  return {
    'Content-Security-Policy': policy,
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'X-Frame-Options': 'DENY',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
    'Cross-Origin-Resource-Policy': 'same-origin',
    'Cross-Origin-Opener-Policy': 'same-origin',
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, root, '')
  const dev = mode !== 'production'
  const policy = contentSecurityPolicy(apiOrigin(env.VITE_API_BASE_URL), dev)
  const headers = securityHeaders(policy)

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(root, 'src'),
      },
    },
    server: {
      cors: false,
      headers,
    },
    preview: {
      cors: false,
      headers,
    },
  }
})

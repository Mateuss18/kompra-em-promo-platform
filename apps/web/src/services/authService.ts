import type { AuthSession, AuthUser, LoginCredentials } from '@/types/auth'

const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
let currentAccessToken: string | null = null

export const getAccessToken = () => currentAccessToken

export const setAccessToken = (accessToken: string | null) => {
  currentAccessToken = accessToken
}

function parseUser(value: unknown): AuthUser {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('id' in value) ||
    typeof value.id !== 'string' ||
    !('email' in value) ||
    typeof value.email !== 'string' ||
    !('role' in value) ||
    value.role !== 'ADMIN'
  ) {
    throw new Error('Invalid authentication response')
  }

  return value as AuthUser
}

function parseSession(value: unknown): AuthSession {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('accessToken' in value) ||
    typeof value.accessToken !== 'string' ||
    !('user' in value)
  ) {
    throw new Error('Invalid authentication response')
  }

  return { accessToken: value.accessToken, user: parseUser(value.user) }
}

async function request(
  path: string,
  options: { method?: 'GET' | 'POST'; body?: LoginCredentials; accessToken?: string } = {},
) {
  const headers = new Headers()

  if (options.body) {
    headers.set('Content-Type', 'application/json')
  }

  if (options.accessToken) {
    headers.set('Authorization', `Bearer ${options.accessToken}`)
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
    credentials: 'include',
  })

  if (!response.ok) {
    throw Object.assign(new Error('Authentication request failed'), { status: response.status })
  }

  return response
}

async function readSession(response: Response) {
  return parseSession(await response.json())
}

export const authService = {
  async login(credentials: LoginCredentials) {
    return readSession(await request('/api/auth/login', { method: 'POST', body: credentials }))
  },

  async refresh() {
    return readSession(await request('/api/auth/refresh', { method: 'POST' }))
  },

  async logout() {
    await request('/api/auth/logout', { method: 'POST' })
  },

  async me(accessToken: string) {
    const response = await request('/api/auth/me', { accessToken })
    const value: unknown = await response.json()

    if (typeof value !== 'object' || value === null || !('user' in value)) {
      throw new Error('Invalid authentication response')
    }

    return parseUser(value.user)
  },
}

import { afterEach, describe, expect, it, vi } from 'vitest'

import { authService } from '@/services/authService'

const apiUrl = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

describe('authService', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('sends credentials and validates the login response', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        accessToken: 'access-token',
        user: { id: 'admin-id', email: 'admin@example.com', role: 'ADMIN' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      authService.login({ email: 'admin@example.com', password: 'secret' }),
    ).resolves.toEqual({
      accessToken: 'access-token',
      user: { id: 'admin-id', email: 'admin@example.com', role: 'ADMIN' },
    })
    expect(fetchMock).toHaveBeenCalledWith(
      `${apiUrl}/api/auth/login`,
      expect.objectContaining({
        body: JSON.stringify({ email: 'admin@example.com', password: 'secret' }),
        credentials: 'include',
        method: 'POST',
      }),
    )
  })

  it('sends the access token when loading the current user', async () => {
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      Response.json({
        user: { id: 'admin-id', email: 'admin@example.com', role: 'ADMIN' },
      }),
    )
    vi.stubGlobal('fetch', fetchMock)

    await expect(authService.me('access-token')).resolves.toEqual({
      id: 'admin-id',
      email: 'admin@example.com',
      role: 'ADMIN',
    })
    const request = fetchMock.mock.calls[0]?.[1]
    expect(new Headers(request?.headers).get('Authorization')).toBe('Bearer access-token')
  })
})

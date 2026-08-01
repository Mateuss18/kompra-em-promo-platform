import { Role, type PrismaClient, type User } from '../src/generated/prisma/client.js'
import { afterEach, describe, expect, it } from 'vitest'

import { createApp } from '../src/app/createApp.js'
import type { ApiConfig } from '../src/config/env.js'
import { hashPassword } from '../src/modules/auth/password.js'

const config: ApiConfig = {
  host: '127.0.0.1',
  port: 3000,
  accessTokenSecret: 'test-access-token-secret-with-32-characters',
  accessTokenTtl: '15m',
  refreshTokenDays: 30,
  loginRateLimitMax: 5,
  webOrigin: 'http://localhost:5173',
  secureCookies: false,
  databaseUrl: 'postgresql://unused',
}

const apps: Awaited<ReturnType<typeof createApp>>[] = []

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()))
})

const readCookie = (header: string | string[] | undefined) => {
  const value = Array.isArray(header) ? header[0] : header

  if (!value) throw new Error('Expected a response cookie')

  const cookie = value.split(';', 1)[0]

  if (!cookie) throw new Error('Expected a response cookie')

  return cookie
}

const createFakePrisma = async () => {
  const now = new Date()
  const user: User = {
    id: 'admin-id',
    email: 'admin@example.com',
    passwordHash: await hashPassword('correct horse battery staple'),
    role: Role.ADMIN,
    createdAt: now,
    updatedAt: now,
  }
  const refreshTokens = new Map<string, { tokenHash: string; userId: string; expiresAt: Date }>()
  const database = {
    user: {
      findUnique: async ({ where }: { where: { email?: string; id?: string } }) =>
        where.email === user.email || where.id === user.id ? user : null,
    },
    refreshToken: {
      create: async ({
        data,
      }: {
        data: { tokenHash: string; userId: string; expiresAt: Date }
      }) => {
        refreshTokens.set(data.tokenHash, data)
        return { ...data, createdAt: now }
      },
      findUnique: async ({ where }: { where: { tokenHash: string } }) => {
        const token = refreshTokens.get(where.tokenHash)
        return token ? { ...token, createdAt: now, user } : null
      },
      deleteMany: async ({ where }: { where: { tokenHash: string } }) => ({
        count: refreshTokens.delete(where.tokenHash) ? 1 : 0,
      }),
    },
  }
  const prisma = {
    ...database,
    $transaction: async (operation: (transaction: PrismaClient) => Promise<unknown>) =>
      operation(prisma as unknown as PrismaClient),
    $disconnect: async () => undefined,
  }

  return prisma as unknown as PrismaClient
}

describe('authentication API', () => {
  it('logs in, rotates the refresh token, authenticates and logs out', async () => {
    const app = await createApp({ config, prisma: await createFakePrisma() })
    apps.push(app)

    const login = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'ADMIN@example.com', password: 'correct horse battery staple' },
    })

    expect(login.statusCode).toBe(200)
    const loginBody = login.json<{ accessToken: string }>()
    const initialCookie = readCookie(login.headers['set-cookie'])
    expect(initialCookie).toMatch(/^refresh_token=/)

    const me = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: `Bearer ${loginBody.accessToken}` },
    })
    expect(me.statusCode).toBe(200)
    expect(me.json<{ user: { role: string } }>().user.role).toBe('ADMIN')

    const forbiddenToken = app.jwt.sign(
      { role: 'VIEWER' as Role },
      { sub: 'admin-id', expiresIn: '15m' },
    )
    const forbidden = await app.inject({
      method: 'GET',
      url: '/api/auth/me',
      headers: { authorization: `Bearer ${forbiddenToken}` },
    })
    expect(forbidden.statusCode).toBe(403)

    const refresh = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      headers: { cookie: initialCookie },
    })
    const rotatedCookie = readCookie(refresh.headers['set-cookie'])
    expect(refresh.statusCode).toBe(200)
    expect(rotatedCookie).not.toBe(initialCookie)

    const reuse = await app.inject({
      method: 'POST',
      url: '/api/auth/refresh',
      headers: { cookie: initialCookie },
    })
    expect(reuse.statusCode).toBe(401)

    const logout = await app.inject({
      method: 'POST',
      url: '/api/auth/logout',
      headers: { cookie: rotatedCookie },
    })
    expect(logout.statusCode).toBe(204)
  })

  it('rejects invalid credentials', async () => {
    const app = await createApp({ config, prisma: await createFakePrisma() })
    apps.push(app)

    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'admin@example.com', password: 'wrong password' },
    })

    expect(response.statusCode).toBe(401)
    expect(response.headers['set-cookie']).toBeUndefined()
  })

  it('rate limits repeated login attempts', async () => {
    const app = await createApp({
      config: { ...config, loginRateLimitMax: 1 },
      prisma: await createFakePrisma(),
    })
    apps.push(app)

    await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'admin@example.com', password: 'wrong password' },
    })
    const response = await app.inject({
      method: 'POST',
      url: '/api/auth/login',
      payload: { email: 'admin@example.com', password: 'wrong password' },
    })

    expect(response.statusCode).toBe(429)
  })
})

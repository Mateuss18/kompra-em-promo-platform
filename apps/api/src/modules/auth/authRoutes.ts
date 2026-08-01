import type { FastifyInstance, FastifyReply } from 'fastify'

import type { ApiConfig } from '../../config/env.js'
import { createAuthService } from './authService.js'

const REFRESH_COOKIE = 'refresh_token'

const loginBodySchema = {
  type: 'object',
  additionalProperties: false,
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email', maxLength: 320 },
    password: { type: 'string', minLength: 1, maxLength: 1_024 },
  },
} as const

const setRefreshCookie = (reply: FastifyReply, token: string, config: ApiConfig) =>
  reply.setCookie(REFRESH_COOKIE, token, {
    path: '/api/auth',
    httpOnly: true,
    sameSite: 'lax',
    secure: config.secureCookies,
    maxAge: config.refreshTokenDays * 24 * 60 * 60,
  })

const clearRefreshCookie = (reply: FastifyReply, config: ApiConfig) =>
  reply.clearCookie(REFRESH_COOKIE, {
    path: '/api/auth',
    httpOnly: true,
    sameSite: 'lax',
    secure: config.secureCookies,
  })

export const registerAuthRoutes = async (app: FastifyInstance, config: ApiConfig) => {
  const authService = createAuthService(
    app.prisma,
    (user) => app.jwt.sign({ role: user.role }, { sub: user.id, expiresIn: config.accessTokenTtl }),
    config.refreshTokenDays,
  )

  app.post<{ Body: { email: string; password: string } }>(
    '/api/auth/login',
    {
      schema: { body: loginBodySchema },
      config: {
        rateLimit: {
          max: config.loginRateLimitMax,
          timeWindow: '15 minutes',
        },
      },
    },
    async (request, reply) => {
      const session = await authService.login(request.body.email, request.body.password)

      if (!session) return reply.code(401).send({ message: 'Invalid credentials' })

      setRefreshCookie(reply, session.refreshToken, config)
      return { accessToken: session.accessToken, user: session.user }
    },
  )

  app.post('/api/auth/refresh', async (request, reply) => {
    const rawToken = request.cookies[REFRESH_COOKIE]

    if (!rawToken) return reply.code(401).send({ message: 'Invalid refresh token' })

    const session = await authService.refresh(rawToken)

    if (!session) {
      clearRefreshCookie(reply, config)
      return reply.code(401).send({ message: 'Invalid refresh token' })
    }

    setRefreshCookie(reply, session.refreshToken, config)
    return { accessToken: session.accessToken, user: session.user }
  })

  app.post('/api/auth/logout', async (request, reply) => {
    await authService.logout(request.cookies[REFRESH_COOKIE])
    clearRefreshCookie(reply, config)
    return reply.code(204).send()
  })

  app.get('/api/auth/me', { preHandler: app.authenticate }, async (request, reply) => {
    const user = await authService.me(request.user.sub)

    if (!user) return reply.code(401).send({ message: 'Unauthorized' })

    return { user }
  })
}

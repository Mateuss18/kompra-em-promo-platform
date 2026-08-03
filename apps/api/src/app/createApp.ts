import cookie from '@fastify/cookie'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import rateLimit from '@fastify/rate-limit'
import Fastify, { type FastifyReply, type FastifyRequest } from 'fastify'

import type { ApiConfig } from '../config/env.js'
import { Role, type PrismaClient } from '../generated/prisma/client.js'
import { registerAuthRoutes } from '../modules/auth/authRoutes.js'
import { registerPromotionRoutes } from '../modules/promotions/promotionRoutes.js'
import { registerTelegramRoutes } from '../modules/telegram/telegramRoutes.js'
import { createPrismaClient } from '../plugins/prisma.js'

const TOKEN_ISSUER = 'kompra-em-promo-api'
const TOKEN_AUDIENCE = 'kompra-em-promo-web'

declare module 'fastify' {
  interface FastifyInstance {
    prisma: PrismaClient
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { role: Role }
    user: { sub: string; role: Role }
  }
}

type CreateAppOptions = {
  config: ApiConfig
  prisma?: PrismaClient
}

export const createApp = async ({ config, prisma }: CreateAppOptions) => {
  const app = Fastify({ logger: true })
  const database = prisma ?? createPrismaClient(config.databaseUrl)

  app.decorate('prisma', database)
  app.decorate('authenticate', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify()
    } catch {
      await reply.code(401).send({ message: 'Unauthorized' })
      return
    }

    if (request.user.role !== Role.ADMIN) {
      await reply.code(403).send({ message: 'Forbidden' })
    }
  })

  await app.register(cors, {
    origin: config.webOrigin,
    credentials: true,
    methods: ['GET', 'HEAD', 'POST', 'PATCH', 'OPTIONS'],
  })
  await app.register(cookie)
  await app.register(jwt, {
    secret: config.accessTokenSecret,
    sign: { iss: TOKEN_ISSUER, aud: TOKEN_AUDIENCE },
    verify: { allowedIss: TOKEN_ISSUER, allowedAud: TOKEN_AUDIENCE },
  })
  await app.register(rateLimit, { global: false })

  app.get('/health', async () => ({ status: 'ok' }))
  await registerAuthRoutes(app, config)
  await registerPromotionRoutes(app)
  await registerTelegramRoutes(app, config)

  if (!prisma) {
    app.addHook('onClose', async () => database.$disconnect())
  }

  return app
}

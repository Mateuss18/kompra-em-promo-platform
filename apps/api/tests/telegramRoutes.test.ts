import {
  PromotionIngestionSource,
  PromotionStatus,
  PromotionStore,
  type PrismaClient,
} from '../src/generated/prisma/client.js'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { createApp } from '../src/app/createApp.js'
import type { ApiConfig } from '../src/config/env.js'

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
  telegramGroupId: '-1001',
  telegramWebhookSecret: 'test-webhook-secret',
  mercadoLivre: null,
}

const apps: Awaited<ReturnType<typeof createApp>>[] = []

afterEach(async () => {
  await Promise.all(apps.splice(0).map((app) => app.close()))
})

const createFakePrisma = (failure?: Error) => {
  const upsert = vi.fn(async ({ create }: { create: Record<string, unknown> }) => {
    if (failure) throw failure

    return {
      ...create,
      id: 'promotion-id',
      createdAt: new Date('2026-08-02T12:00:00.000Z'),
      updatedAt: new Date('2026-08-02T12:00:00.000Z'),
      events: [],
    }
  })
  const prisma = {
    promotion: { upsert },
    $disconnect: async () => undefined,
  } as unknown as PrismaClient

  return { prisma, upsert }
}

const injectTelegramMessage = async (app: Awaited<ReturnType<typeof createApp>>, text: string) =>
  app.inject({
    method: 'POST',
    url: '/api/telegram/webhook',
    headers: { 'x-telegram-bot-api-secret-token': config.telegramWebhookSecret! },
    payload: { message: { chat: { id: -1001 }, message_id: 42, text } },
  })

describe('Telegram link ingestion', () => {
  it('creates an idempotent draft and confirms it in the group', async () => {
    const { prisma, upsert } = createFakePrisma()
    const app = await createApp({ config, prisma })
    apps.push(app)

    const response = await injectTelegramMessage(app, 'https://www.amazon.com.br/dp/B012345678')

    expect(response.statusCode).toBe(200)
    expect(upsert).toHaveBeenCalledWith(
      expect.objectContaining({
        create: expect.objectContaining({
          ingestionSource: PromotionIngestionSource.TELEGRAM,
          status: PromotionStatus.DRAFT,
          store: PromotionStore.AMAZON,
        }),
        where: { sourceReference: 'telegram:-1001:42' },
      }),
    )
    expect(response.json()).toEqual({
      method: 'sendMessage',
      chat_id: -1001,
      text: 'Rascunho criado com sucesso: promotion-id',
    })
  })

  it('responds when the store is unsupported without creating a draft', async () => {
    const { prisma, upsert } = createFakePrisma()
    const app = await createApp({ config, prisma })
    apps.push(app)

    const response = await injectTelegramMessage(app, 'https://example.com/product')

    expect(response.statusCode).toBe(200)
    expect(upsert).not.toHaveBeenCalled()
    expect(response.json()).toEqual({
      method: 'sendMessage',
      chat_id: -1001,
      text: 'Não foi possível criar o rascunho. Envie um link da Shopee, Amazon ou Mercado Livre.',
    })
  })

  it('reports an ingestion failure without exposing its details', async () => {
    const { prisma } = createFakePrisma(new Error('database credentials leaked'))
    const app = await createApp({ config, prisma })
    apps.push(app)

    const response = await injectTelegramMessage(app, 'https://www.amazon.com.br/dp/B012345678')

    expect(response.statusCode).toBe(200)
    expect(response.json()).toEqual({
      method: 'sendMessage',
      chat_id: -1001,
      text: 'Não foi possível criar o rascunho. Tente novamente.',
    })
  })

  it('ignores unauthorized chats without persisting promotions', async () => {
    const { prisma, upsert } = createFakePrisma()
    const app = await createApp({ config, prisma })
    apps.push(app)

    const invalidSecret = await app.inject({
      method: 'POST',
      url: '/api/telegram/webhook',
      headers: { 'x-telegram-bot-api-secret-token': 'invalid-secret' },
      payload: {
        message: {
          chat: { id: -1001 },
          message_id: 42,
          text: 'https://www.amazon.com.br/dp/B012345678',
        },
      },
    })
    const differentChat = await app.inject({
      method: 'POST',
      url: '/api/telegram/webhook',
      headers: { 'x-telegram-bot-api-secret-token': config.telegramWebhookSecret! },
      payload: {
        message: {
          chat: { id: -2002 },
          message_id: 42,
          text: 'https://www.amazon.com.br/dp/B012345678',
        },
      },
    })

    expect(invalidSecret.statusCode).toBe(401)
    expect(differentChat.statusCode).toBe(200)
    expect(differentChat.json()).toEqual({ ok: true })
    expect(upsert).not.toHaveBeenCalled()
  })
})

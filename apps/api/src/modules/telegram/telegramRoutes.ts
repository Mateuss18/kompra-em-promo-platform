import { timingSafeEqual } from 'node:crypto'

import type { FastifyInstance } from 'fastify'

import type { ApiConfig } from '../../config/env.js'
import { PromotionIngestionSource } from '../../generated/prisma/client.js'
import { createPromotionService, detectStore } from '../promotions/promotionService.js'

type TelegramUpdate = {
  message?: {
    chat?: { id?: number }
    message_id?: number
    text?: string
  }
}

export function extractPromotionUrl(text: string) {
  return text.match(/https?:\/\/[^\s<>()]+/g)?.find((value) => {
    try {
      detectStore(value)
      return true
    } catch {
      return false
    }
  })
}

const secretsMatch = (left: string | undefined, right: string) => {
  if (!left || left.length !== right.length) return false
  return timingSafeEqual(Buffer.from(left), Buffer.from(right))
}

export const registerTelegramRoutes = async (app: FastifyInstance, config: ApiConfig) => {
  if (!config.telegramGroupId || !config.telegramWebhookSecret) return

  const promotionService = createPromotionService(app.prisma)

  app.post<{ Body: TelegramUpdate }>(
    '/api/telegram/webhook',
    { schema: { body: { type: 'object', additionalProperties: true } } },
    async (request, reply) => {
      const secretHeader = request.headers['x-telegram-bot-api-secret-token']
      if (
        Array.isArray(secretHeader) ||
        !secretsMatch(secretHeader, config.telegramWebhookSecret!)
      ) {
        return reply.code(401).send({ message: 'Unauthorized' })
      }

      const message = request.body.message
      if (
        message?.chat?.id?.toString() !== config.telegramGroupId ||
        message.message_id === undefined ||
        !message.text
      ) {
        return { ok: true }
      }

      const url = extractPromotionUrl(message.text)
      if (!url) return { ok: true }

      await promotionService.createDraft(
        url,
        PromotionIngestionSource.TELEGRAM,
        `telegram:${message.chat.id}:${message.message_id}`,
      )

      return { ok: true }
    },
  )
}

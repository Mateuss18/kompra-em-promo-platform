import type { FastifyInstance, FastifyReply } from 'fastify'

import {
  PromotionIngestionSource,
  PromotionStatus,
  PromotionStore,
  PromotionWorkflowAction,
} from '../../generated/prisma/client.js'
import { createPromotionService, PromotionServiceError } from './promotionService.js'

const stores = Object.values(PromotionStore)
const statuses = Object.values(PromotionStatus)
const actions = Object.values(PromotionWorkflowAction)
const sorts = ['NEWEST', 'OLDEST', 'PRICE_ASC', 'PRICE_DESC'] as const

const handleError = (error: unknown, reply: FastifyReply) => {
  if (error instanceof PromotionServiceError) {
    return reply.code(error.statusCode).send({ message: error.message })
  }

  throw error
}

export const registerPromotionRoutes = async (app: FastifyInstance) => {
  const promotionService = createPromotionService(app.prisma)

  app.post<{ Body: { url: string } }>(
    '/api/promotions/ingest',
    {
      preHandler: app.authenticate,
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['url'],
          properties: { url: { type: 'string', minLength: 1, maxLength: 2_048 } },
        },
      },
    },
    async (request, reply) => {
      try {
        return await promotionService.createDraft(request.body.url, PromotionIngestionSource.WEB)
      } catch (error) {
        return handleError(error, reply)
      }
    },
  )

  app.get<{
    Querystring: {
      page?: string
      pageSize?: string
      search?: string
      sort?: (typeof sorts)[number]
      status?: PromotionStatus | 'ALL'
      store?: PromotionStore | 'ALL'
    }
  }>(
    '/api/promotions',
    {
      preHandler: app.authenticate,
      schema: {
        querystring: {
          type: 'object',
          additionalProperties: false,
          properties: {
            page: { type: 'integer', minimum: 1, default: 1 },
            pageSize: { type: 'integer', minimum: 1, maximum: 10_000, default: 5 },
            search: { type: 'string', maxLength: 200, default: '' },
            sort: { type: 'string', enum: sorts, default: 'NEWEST' },
            status: { type: 'string', enum: ['ALL', ...statuses], default: 'ALL' },
            store: { type: 'string', enum: ['ALL', ...stores], default: 'ALL' },
          },
        },
      },
    },
    async (request) =>
      promotionService.list({
        page: Number(request.query.page ?? 1),
        pageSize: Number(request.query.pageSize ?? 5),
        search: request.query.search?.trim() ?? '',
        sort: request.query.sort ?? 'NEWEST',
        ...(request.query.status && request.query.status !== 'ALL'
          ? { status: request.query.status }
          : {}),
        ...(request.query.store && request.query.store !== 'ALL'
          ? { store: request.query.store }
          : {}),
      }),
  )

  app.get<{ Params: { id: string } }>(
    '/api/promotions/:id',
    { preHandler: app.authenticate },
    async (request, reply) => {
      const promotion = await promotionService.getById(request.params.id)
      return promotion ?? reply.code(404).send({ message: 'Promotion not found' })
    },
  )

  app.patch<{
    Params: { id: string }
    Body: {
      couponCode: string | null
      message: string
      originalPriceInCents: number | null
      priceInCents: number
      title: string
    }
  }>(
    '/api/promotions/:id',
    {
      preHandler: app.authenticate,
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['couponCode', 'message', 'originalPriceInCents', 'priceInCents', 'title'],
          properties: {
            couponCode: { anyOf: [{ type: 'string', maxLength: 100 }, { type: 'null' }] },
            message: { type: 'string', minLength: 1, maxLength: 10_000 },
            originalPriceInCents: {
              anyOf: [{ type: 'integer', minimum: 1 }, { type: 'null' }],
            },
            priceInCents: { type: 'integer', minimum: 1 },
            title: { type: 'string', minLength: 1, maxLength: 500 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const promotion = await promotionService.update(request.params.id, request.body)
        return promotion ?? reply.code(404).send({ message: 'Promotion not found' })
      } catch (error) {
        return handleError(error, reply)
      }
    },
  )

  app.post<{
    Params: { id: string }
    Body: { action: PromotionWorkflowAction; rejectionReason?: string }
  }>(
    '/api/promotions/:id/transitions',
    {
      preHandler: app.authenticate,
      schema: {
        body: {
          type: 'object',
          additionalProperties: false,
          required: ['action'],
          properties: {
            action: { type: 'string', enum: actions },
            rejectionReason: { type: 'string', maxLength: 1_000 },
          },
        },
      },
    },
    async (request, reply) => {
      try {
        const promotion = await promotionService.transition(
          request.params.id,
          request.body.action,
          request.body.rejectionReason,
        )
        return promotion ?? reply.code(404).send({ message: 'Promotion not found' })
      } catch (error) {
        return handleError(error, reply)
      }
    },
  )
}

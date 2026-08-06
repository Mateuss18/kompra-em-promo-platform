import {
  PromotionIngestionSource,
  PromotionStatus,
  PromotionStore,
  PromotionWorkflowAction,
  Role,
  type Prisma,
  type PrismaClient,
} from '../../generated/prisma/client.js'
import { selectParser } from './parsers/index.js'

const DEFAULT_MESSAGE =
  'Rascunho criado a partir do link. Edite o conteúdo antes de enviar para revisão.'

const TRANSITIONS: Record<
  PromotionWorkflowAction,
  { fromStatus: PromotionStatus; toStatus: PromotionStatus }
> = {
  APPROVE: { fromStatus: PromotionStatus.READY_FOR_REVIEW, toStatus: PromotionStatus.APPROVED },
  PUBLISH: { fromStatus: PromotionStatus.APPROVED, toStatus: PromotionStatus.PUBLISHED },
  REJECT: { fromStatus: PromotionStatus.READY_FOR_REVIEW, toStatus: PromotionStatus.REJECTED },
  SUBMIT_FOR_REVIEW: {
    fromStatus: PromotionStatus.DRAFT,
    toStatus: PromotionStatus.READY_FOR_REVIEW,
  },
}

type PromotionWithEvents = Prisma.PromotionGetPayload<{ include: { events: true } }>

export class PromotionServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message)
  }
}

export function normalizePromotionUrl(value: string) {
  let url: URL

  try {
    url = new URL(value.trim())
  } catch {
    throw new PromotionServiceError('Invalid URL', 400)
  }

  if (!['http:', 'https:'].includes(url.protocol)) {
    throw new PromotionServiceError('Invalid URL', 400)
  }

  return url.toString()
}

export function detectStore(value: string): PromotionStore {
  const sourceUrl = normalizePromotionUrl(value)
  const parser = selectParser(sourceUrl)

  if (!parser) {
    throw new PromotionServiceError('Unsupported store', 400)
  }

  return parser.store
}

const toPromotion = (promotion: PromotionWithEvents) => ({
  ...promotion,
  createdAt: promotion.createdAt.toISOString(),
  updatedAt: promotion.updatedAt.toISOString(),
  events: promotion.events.map((event) => ({
    ...event,
    createdAt: event.createdAt.toISOString(),
  })),
  productImageUrl: promotion.productImageUrl ?? null,
})

export const createPromotionService = (prisma: PrismaClient) => ({
  async createDraft(
    value: string,
    ingestionSource: PromotionIngestionSource,
    sourceReference?: string,
  ) {
    const sourceUrl = normalizePromotionUrl(value)
    const store = detectStore(sourceUrl)
    const parser = selectParser(sourceUrl)
    const parsed = parser!.parse(sourceUrl)
    const affiliateUrl = parser!.normalizeAffiliateUrl(sourceUrl)
    const data = {
      affiliateUrl,
      couponCode: null,
      ingestionSource,
      message: DEFAULT_MESSAGE,
      originalPriceInCents: null,
      priceInCents:
        typeof parsed.priceInCents === 'number' && parsed.priceInCents > 0
          ? parsed.priceInCents
          : 1_000,
      productImageUrl: parsed.imageUrl,
      sourceReference: sourceReference ?? null,
      sourceUrl,
      status: PromotionStatus.DRAFT,
      store,
      title: parsed.title ?? 'Nova promoção',
    }

    if (sourceReference) {
      return toPromotion(
        await prisma.promotion.upsert({
          where: { sourceReference },
          update: {},
          create: data,
          include: { events: true },
        }),
      )
    }

    return toPromotion(await prisma.promotion.create({ data, include: { events: true } }))
  },

  async getById(id: string) {
    const promotion = await prisma.promotion.findUnique({
      where: { id },
      include: { events: { orderBy: { createdAt: 'asc' } } },
    })

    return promotion ? toPromotion(promotion) : null
  },

  async list(input: {
    page: number
    pageSize: number
    search: string
    sort: 'NEWEST' | 'OLDEST' | 'PRICE_ASC' | 'PRICE_DESC'
    status?: PromotionStatus
    store?: PromotionStore
  }) {
    const where: Prisma.PromotionWhereInput = {
      ...(input.status ? { status: input.status } : {}),
      ...(input.store ? { store: input.store } : {}),
      ...(input.search ? { title: { contains: input.search, mode: 'insensitive' } } : {}),
    }
    const orderBy: Prisma.PromotionOrderByWithRelationInput =
      input.sort === 'PRICE_ASC'
        ? { priceInCents: 'asc' }
        : input.sort === 'PRICE_DESC'
          ? { priceInCents: 'desc' }
          : { createdAt: input.sort === 'OLDEST' ? 'asc' : 'desc' }
    const total = await prisma.promotion.count({ where })
    const pageCount = Math.max(1, Math.ceil(total / input.pageSize))
    const page = Math.min(input.page, pageCount)
    const items = await prisma.promotion.findMany({
      where,
      orderBy,
      skip: (page - 1) * input.pageSize,
      take: input.pageSize,
      include: { events: { orderBy: { createdAt: 'asc' } } },
    })

    return { items: items.map(toPromotion), page, pageCount, total }
  },

  async update(
    id: string,
    input: {
      couponCode: string | null
      message: string
      originalPriceInCents: number | null
      priceInCents: number
      title: string
    },
  ) {
    const promotion = await prisma.promotion.findUnique({ where: { id } })
    if (!promotion) return null
    if (
      promotion.status !== PromotionStatus.DRAFT &&
      promotion.status !== PromotionStatus.READY_FOR_REVIEW
    ) {
      throw new PromotionServiceError(
        'Promotion content cannot be edited in its current status',
        409,
      )
    }

    const title = input.title.trim()
    const message = input.message.trim()
    const pricesAreValid =
      Number.isInteger(input.priceInCents) &&
      input.priceInCents > 0 &&
      (input.originalPriceInCents === null ||
        (Number.isInteger(input.originalPriceInCents) && input.originalPriceInCents > 0))

    if (!title || !message || !pricesAreValid) {
      throw new PromotionServiceError('Invalid promotion content', 400)
    }

    return toPromotion(
      await prisma.promotion.update({
        where: { id },
        data: {
          ...input,
          couponCode: input.couponCode?.trim() || null,
          message,
          title,
        },
        include: { events: { orderBy: { createdAt: 'asc' } } },
      }),
    )
  },

  async transition(id: string, action: PromotionWorkflowAction, rejectionReason?: string) {
    const promotion = await prisma.promotion.findUnique({ where: { id } })
    if (!promotion) return null

    const transition = TRANSITIONS[action]
    if (promotion.status !== transition.fromStatus) {
      throw new PromotionServiceError('Invalid promotion transition', 409)
    }

    const reason = rejectionReason?.trim() || null
    if (action === PromotionWorkflowAction.REJECT && !reason) {
      throw new PromotionServiceError('Rejection reason is required', 400)
    }

    return prisma.$transaction(async (transaction) => {
      await transaction.promotionEvent.create({
        data: {
          action,
          actor: Role.ADMIN,
          fromStatus: promotion.status,
          promotionId: id,
          reason: action === PromotionWorkflowAction.REJECT ? reason : null,
          toStatus: transition.toStatus,
        },
      })

      return toPromotion(
        await transaction.promotion.update({
          where: { id },
          data: { status: transition.toStatus },
          include: { events: { orderBy: { createdAt: 'asc' } } },
        }),
      )
    })
  },
})

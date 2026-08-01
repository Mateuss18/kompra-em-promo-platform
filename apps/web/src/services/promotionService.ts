import { promotionsMock } from '@/mocks/promotions'
import type {
  Promotion,
  PromotionEvent,
  PromotionFilters,
  PromotionPage,
  PromotionStatus,
  PromotionStore,
  PromotionWorkflowAction,
  UpdatePromotionInput,
} from '@/types/promotion'

const STORAGE_KEY = 'kompra-em-promo:promotions'
const PROMOTION_STATUSES = new Set<PromotionStatus>([
  'APPROVED',
  'DRAFT',
  'FAILED',
  'PROCESSING',
  'PUBLISHED',
  'PUBLISHING',
  'READY_FOR_REVIEW',
  'REJECTED',
])
const PROMOTION_STORES = new Set<PromotionStore>(['AMAZON', 'MERCADO_LIVRE', 'SHOPEE'])
const WORKFLOW_ACTIONS = new Set<PromotionWorkflowAction>([
  'APPROVE',
  'PUBLISH',
  'REJECT',
  'SUBMIT_FOR_REVIEW',
])
const TRANSITIONS: Record<
  PromotionWorkflowAction,
  { fromStatus: PromotionStatus; toStatus: PromotionStatus }
> = {
  APPROVE: { fromStatus: 'READY_FOR_REVIEW', toStatus: 'APPROVED' },
  PUBLISH: { fromStatus: 'APPROVED', toStatus: 'PUBLISHED' },
  REJECT: { fromStatus: 'READY_FOR_REVIEW', toStatus: 'REJECTED' },
  SUBMIT_FOR_REVIEW: { fromStatus: 'DRAFT', toStatus: 'READY_FOR_REVIEW' },
}

function isPromotionEvent(value: unknown): value is PromotionEvent {
  if (!value || typeof value !== 'object') return false

  const event = value as Record<string, unknown>

  return (
    typeof event.action === 'string' &&
    WORKFLOW_ACTIONS.has(event.action as PromotionWorkflowAction) &&
    event.actor === 'ADMIN' &&
    typeof event.createdAt === 'string' &&
    typeof event.fromStatus === 'string' &&
    PROMOTION_STATUSES.has(event.fromStatus as PromotionStatus) &&
    typeof event.id === 'string' &&
    (event.reason === null || typeof event.reason === 'string') &&
    typeof event.toStatus === 'string' &&
    PROMOTION_STATUSES.has(event.toStatus as PromotionStatus)
  )
}

function isPromotion(value: unknown): value is Promotion {
  if (!value || typeof value !== 'object') return false

  const promotion = value as Record<string, unknown>

  return (
    typeof promotion.affiliateUrl === 'string' &&
    (promotion.couponCode === null || typeof promotion.couponCode === 'string') &&
    typeof promotion.createdAt === 'string' &&
    (promotion.events === undefined ||
      (Array.isArray(promotion.events) && promotion.events.every(isPromotionEvent))) &&
    typeof promotion.id === 'string' &&
    typeof promotion.message === 'string' &&
    (promotion.originalPriceInCents === null ||
      typeof promotion.originalPriceInCents === 'number') &&
    typeof promotion.priceInCents === 'number' &&
    typeof promotion.sourceUrl === 'string' &&
    typeof promotion.status === 'string' &&
    PROMOTION_STATUSES.has(promotion.status as PromotionStatus) &&
    typeof promotion.store === 'string' &&
    PROMOTION_STORES.has(promotion.store as PromotionStore) &&
    typeof promotion.title === 'string' &&
    typeof promotion.updatedAt === 'string'
  )
}

function readPromotions(): Promotion[] {
  const storedPromotions = localStorage.getItem(STORAGE_KEY)
  if (!storedPromotions) return structuredClone(promotionsMock)

  try {
    const parsed: unknown = JSON.parse(storedPromotions)
    return Array.isArray(parsed) && parsed.every(isPromotion)
      ? parsed
      : structuredClone(promotionsMock)
  } catch {
    return structuredClone(promotionsMock)
  }
}

export const promotionService = {
  async getById(id: string): Promise<Promotion | null> {
    return structuredClone(readPromotions().find((promotion) => promotion.id === id) ?? null)
  },

  async list(filters: PromotionFilters): Promise<PromotionPage> {
    const search = filters.search.trim().toLocaleLowerCase('pt-BR')
    const items = readPromotions().filter(
      (promotion) =>
        (!search || promotion.title.toLocaleLowerCase('pt-BR').includes(search)) &&
        (filters.status === 'ALL' || promotion.status === filters.status) &&
        (filters.store === 'ALL' || promotion.store === filters.store),
    )

    items.sort((left, right) => {
      if (filters.sort === 'PRICE_ASC') return left.priceInCents - right.priceInCents
      if (filters.sort === 'PRICE_DESC') return right.priceInCents - left.priceInCents
      if (filters.sort === 'OLDEST') return left.createdAt.localeCompare(right.createdAt)
      return right.createdAt.localeCompare(left.createdAt)
    })

    const total = items.length
    const pageCount = Math.max(1, Math.ceil(total / filters.pageSize))
    const page = Math.min(filters.page, pageCount)
    const start = (page - 1) * filters.pageSize

    return structuredClone({
      items: items.slice(start, start + filters.pageSize),
      page,
      pageCount,
      total,
    })
  },

  async update(id: string, input: UpdatePromotionInput): Promise<Promotion | null> {
    const title = input.title.trim()
    const message = input.message.trim()
    const pricesAreValid =
      Number.isInteger(input.priceInCents) &&
      input.priceInCents > 0 &&
      (input.originalPriceInCents === null ||
        (Number.isInteger(input.originalPriceInCents) && input.originalPriceInCents > 0))

    if (!title || !message || !pricesAreValid) {
      throw new Error('Invalid promotion content')
    }

    const promotions = readPromotions()
    const index = promotions.findIndex((promotion) => promotion.id === id)
    if (index === -1) return null
    if (!['DRAFT', 'READY_FOR_REVIEW'].includes(promotions[index]!.status)) {
      throw new Error('Promotion content cannot be edited in its current status')
    }

    const updatedPromotion: Promotion = {
      ...promotions[index]!,
      ...input,
      couponCode: input.couponCode?.trim() || null,
      message,
      title,
      updatedAt: new Date().toISOString(),
    }

    promotions[index] = updatedPromotion
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions))

    return structuredClone(updatedPromotion)
  },

  async transition(
    id: string,
    action: PromotionWorkflowAction,
    rejectionReason?: string,
  ): Promise<Promotion | null> {
    const promotions = readPromotions()
    const index = promotions.findIndex((promotion) => promotion.id === id)
    if (index === -1) return null

    const promotion = promotions[index]!
    const transition = TRANSITIONS[action]
    if (promotion.status !== transition.fromStatus) {
      throw new Error('Invalid promotion transition')
    }

    const reason = rejectionReason?.trim() || null
    if (action === 'REJECT' && !reason) {
      throw new Error('Rejection reason is required')
    }

    const createdAt = new Date().toISOString()
    const event: PromotionEvent = {
      action,
      actor: 'ADMIN',
      createdAt,
      fromStatus: promotion.status,
      id: `${promotion.id}:${createdAt}:${promotion.events?.length ?? 0}`,
      reason: action === 'REJECT' ? reason : null,
      toStatus: transition.toStatus,
    }
    const updatedPromotion: Promotion = {
      ...promotion,
      events: [...(promotion.events ?? []), event],
      status: transition.toStatus,
      updatedAt: createdAt,
    }

    promotions[index] = updatedPromotion
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions))

    return structuredClone(updatedPromotion)
  },
}

import { promotionsMock } from '@/mocks/promotions'
import type {
  Promotion,
  PromotionFilters,
  PromotionPage,
  UpdatePromotionInput,
} from '@/types/promotion'

const STORAGE_KEY = 'kompra-em-promo:promotions'

function isPromotion(value: unknown): value is Promotion {
  if (!value || typeof value !== 'object') return false

  const promotion = value as Record<string, unknown>

  return (
    typeof promotion.affiliateUrl === 'string' &&
    (promotion.couponCode === null || typeof promotion.couponCode === 'string') &&
    typeof promotion.createdAt === 'string' &&
    typeof promotion.id === 'string' &&
    typeof promotion.message === 'string' &&
    (promotion.originalPriceInCents === null ||
      typeof promotion.originalPriceInCents === 'number') &&
    typeof promotion.priceInCents === 'number' &&
    typeof promotion.sourceUrl === 'string' &&
    typeof promotion.status === 'string' &&
    typeof promotion.store === 'string' &&
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
}

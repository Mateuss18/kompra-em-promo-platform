import { promotionsMock } from '@/mocks/promotions'
import type { Promotion, PromotionFilters, PromotionPage } from '@/types/promotion'

export const promotionService = {
  async getById(id: string): Promise<Promotion | null> {
    return structuredClone(promotionsMock.find((promotion) => promotion.id === id) ?? null)
  },

  async list(filters: PromotionFilters): Promise<PromotionPage> {
    const search = filters.search.trim().toLocaleLowerCase('pt-BR')
    const items = promotionsMock.filter(
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
}

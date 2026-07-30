import { describe, expect, it } from 'vitest'

import { promotionService } from '@/services/promotionService'
import type { PromotionFilters } from '@/types/promotion'

const defaultFilters: PromotionFilters = {
  page: 1,
  pageSize: 5,
  search: '',
  sort: 'NEWEST',
  status: 'ALL',
  store: 'ALL',
}

describe('promotionService', () => {
  it('filters promotions by title, store and status', async () => {
    const result = await promotionService.list({
      ...defaultFilters,
      search: 'smart tv',
      status: 'APPROVED',
      store: 'AMAZON',
    })

    expect(result.total).toBe(1)
    expect(result.items[0]?.title).toBe('Smart TV Samsung Crystal UHD 50"')
  })

  it('sorts prices and paginates results', async () => {
    const result = await promotionService.list({
      ...defaultFilters,
      page: 2,
      pageSize: 3,
      sort: 'PRICE_ASC',
    })

    expect(result.page).toBe(2)
    expect(result.pageCount).toBe(4)
    expect(result.total).toBe(12)
    expect(result.items.map((promotion) => promotion.priceInCents)).toEqual([24990, 32990, 35990])
  })

  it('finds a promotion by its opaque id', async () => {
    const promotion = await promotionService.getById('promo_01K1CP2Y9M4K7D6A3Q8R')

    expect(promotion?.title).toBe('Echo Pop com Alexa')
    await expect(promotionService.getById('missing')).resolves.toBeNull()
  })
})

import { beforeEach, describe, expect, it } from 'vitest'

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
  beforeEach(() => {
    localStorage.clear()
  })

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

  it('updates and persists promotion content', async () => {
    const id = 'promo_01K1D9F2B6VQ8S4T7X3M'
    const beforeUpdate = await promotionService.getById(id)
    const updatedPromotion = await promotionService.update(id, {
      couponCode: ' ALEXA20 ',
      message: ' Oferta revisada. ',
      originalPriceInCents: null,
      priceInCents: 21990,
      title: ' Echo Pop em oferta ',
    })
    const persistedPromotion = await promotionService.getById(id)

    expect(updatedPromotion).toMatchObject({
      couponCode: 'ALEXA20',
      message: 'Oferta revisada.',
      originalPriceInCents: null,
      priceInCents: 21990,
      title: 'Echo Pop em oferta',
    })
    expect(persistedPromotion).toEqual(updatedPromotion)
    expect(Date.parse(updatedPromotion!.updatedAt)).not.toBeNaN()
    expect(updatedPromotion!.updatedAt >= beforeUpdate!.updatedAt).toBe(true)
  })

  it('persists valid workflow transitions and their events', async () => {
    const id = 'promo_01K1D9F2B6VQ8S4T7X3M'

    await promotionService.transition(id, 'SUBMIT_FOR_REVIEW')
    await promotionService.transition(id, 'APPROVE')
    const publishedPromotion = await promotionService.transition(id, 'PUBLISH')
    const persistedPromotion = await promotionService.getById(id)

    expect(publishedPromotion?.status).toBe('PUBLISHED')
    expect(publishedPromotion?.events?.map((event) => event.action)).toEqual([
      'SUBMIT_FOR_REVIEW',
      'APPROVE',
      'PUBLISH',
    ])
    expect(publishedPromotion?.events?.every((event) => event.actor === 'ADMIN')).toBe(true)
    expect(persistedPromotion).toEqual(publishedPromotion)
  })

  it('requires a rejection reason and blocks invalid transitions', async () => {
    const id = 'promo_01K19YQ4F8B2M6V7R3TX'

    await expect(promotionService.transition(id, 'REJECT')).rejects.toThrow(
      'Rejection reason is required',
    )
    await expect(promotionService.transition(id, 'PUBLISH')).rejects.toThrow(
      'Invalid promotion transition',
    )

    const rejectedPromotion = await promotionService.transition(id, 'REJECT', ' Preço incorreto. ')

    expect(rejectedPromotion?.status).toBe('REJECTED')
    expect(rejectedPromotion?.events?.[0]?.reason).toBe('Preço incorreto.')
  })

  it('keeps approved content immutable', async () => {
    await expect(
      promotionService.update('promo_01K1D5A7N2P9R4C6W8YH', {
        couponCode: null,
        message: 'Conteúdo alterado após aprovação.',
        originalPriceInCents: null,
        priceInCents: 299900,
        title: 'Smart TV alterada',
      }),
    ).rejects.toThrow('Promotion content cannot be edited in its current status')
  })
})

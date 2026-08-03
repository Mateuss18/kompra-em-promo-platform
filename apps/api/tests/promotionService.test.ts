import { PromotionStore } from '../src/generated/prisma/client.js'
import { describe, expect, it } from 'vitest'

import {
  detectStore,
  normalizePromotionUrl,
  PromotionServiceError,
} from '../src/modules/promotions/promotionService.js'
import { extractPromotionUrl } from '../src/modules/telegram/telegramRoutes.js'

describe('promotion link ingestion', () => {
  it('detects supported stores from full and short links', () => {
    expect(detectStore('https://s.shopee.com.br/abc')).toBe(PromotionStore.SHOPEE)
    expect(detectStore('https://amzn.to/abc')).toBe(PromotionStore.AMAZON)
    expect(detectStore('https://produto.mercadolivre.com.br/MLB-1')).toBe(
      PromotionStore.MERCADO_LIVRE,
    )
    expect(detectStore('https://meli.la/abc')).toBe(PromotionStore.MERCADO_LIVRE)
  })

  it('rejects unsupported domains and protocols', () => {
    expect(() => detectStore('https://shopee.example.com/product')).toThrow(PromotionServiceError)
    expect(() => normalizePromotionUrl('javascript:alert(1)')).toThrow(PromotionServiceError)
  })

  it('extracts the first supported URL from a Telegram message', () => {
    expect(
      extractPromotionUrl(
        'Ignorar https://example.com e criar https://www.amazon.com.br/dp/B012345678',
      ),
    ).toBe('https://www.amazon.com.br/dp/B012345678')
    expect(extractPromotionUrl('Mensagem sem link compatível')).toBeUndefined()
  })
})

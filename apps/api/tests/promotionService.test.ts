import { PromotionStore } from '../src/generated/prisma/client.js'
import { describe, expect, it } from 'vitest'

import {
  detectStore,
  normalizePromotionUrl,
  PromotionServiceError,
} from '../src/modules/promotions/promotionService.js'
import { amazonParser } from '../src/modules/promotions/parsers/amazonParser.js'
import { mercadoLivreParser } from '../src/modules/promotions/parsers/mercadoLivreParser.js'
import { selectParser, shopeeParser } from '../src/modules/promotions/parsers/index.js'
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

describe('store parser layer', () => {
  it('selects the correct parser for each store', () => {
    expect(selectParser('https://www.amazon.com.br/dp/B012345678')).toBe(amazonParser)
    expect(selectParser('https://www.mercadolivre.com.br/MLB-1')).toBe(mercadoLivreParser)
    expect(selectParser('https://s.shopee.com.br/abc')).toBe(shopeeParser)
  })

  it('preserves Amazon tag param when normalizing affiliate URL', () => {
    const url = 'https://www.amazon.com.br/dp/B012345678?tag=kompra-20'
    expect(amazonParser.normalizeAffiliateUrl(url)).toBe(url)
  })

  it('preserves Mercado Livre matt_tool param when normalizing affiliate URL', () => {
    const url = 'https://www.mercadolivre.com.br/MLB-1?matt_tool=123'
    expect(mercadoLivreParser.normalizeAffiliateUrl(url)).toBe(url)
  })

  it('preserves Shopee affiliate_id param when normalizing affiliate URL', () => {
    const url = 'https://s.shopee.com.br/abc?affiliate_id=456'
    expect(shopeeParser.normalizeAffiliateUrl(url)).toBe(url)
  })

  it('returns the original URL when no affiliate param is present', () => {
    const url = 'https://www.amazon.com.br/dp/B012345678'
    expect(amazonParser.normalizeAffiliateUrl(url)).toBe(url)
  })
})

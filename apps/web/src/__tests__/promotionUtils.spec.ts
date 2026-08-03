import { describe, expect, it } from 'vitest'

import { formatCurrency, generatePromotionMessage } from '@/utils/promotion'

describe('generatePromotionMessage', () => {
  it('builds a full message with discount and prices', () => {
    const message = generatePromotionMessage(
      'Caixa Organizadora 95 Litros',
      9990,
      6990,
      'SHOPEE',
      'https://s.shopee.com.br/2BDZTLM3ym',
    )

    expect(message.startsWith('Caixa Organizadora 95 Litros')).toBe(true)
    expect(message).toContain('*30% de desconto*')
    expect(message).toContain(`~De ${formatCurrency(9990)}~`)
    expect(message).toContain(`*Por ${formatCurrency(6990)}*`)
    expect(message).toContain('🛒 Shopee')
    expect(message).toContain('Caixa Organizadora 95 Litros')
    expect(message).toContain('🔗 Link https://s.shopee.com.br/2BDZTLM3ym')
  })

  it('builds a message without discount when there is no original price', () => {
    const message = generatePromotionMessage(
      'Caixa Organizadora',
      null,
      6990,
      'AMAZON',
      'https://amzn.to/abc123',
    )

    expect(message).toContain(`*Por ${formatCurrency(6990)}*`)
    expect(message).not.toContain('% de desconto')
    expect(message).toContain('🛒 Amazon')
    expect(message).toContain('🔗 Link https://amzn.to/abc123')
  })

  it('skips discount when current price is not lower than original', () => {
    const message = generatePromotionMessage(
      'Caixa Organizadora',
      6990,
      6990,
      'MERCADO_LIVRE',
      'https://mercadolivre.com.br/p/MLB123',
    )

    expect(message).toContain(`*Por ${formatCurrency(6990)}*`)
    expect(message).not.toContain('% de desconto')
    expect(message).toContain('🛒 Mercado Livre')
  })
})

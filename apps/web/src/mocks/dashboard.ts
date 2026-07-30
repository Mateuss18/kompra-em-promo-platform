import type { DashboardData } from '@/types/dashboard'

export const dashboardMock: DashboardData = {
  indicators: {
    approved: 7,
    drafts: 12,
    errors: 2,
    published: 34,
  },
  recentPromotions: [
    {
      createdAt: '2026-07-29T21:42:00.000Z',
      id: 'promo_01K1D9F2B6VQ8S4T7X3M',
      priceInCents: 18990,
      status: 'DRAFT',
      store: 'SHOPEE',
      title: 'Fone Bluetooth Baseus Bowie MA10',
    },
    {
      createdAt: '2026-07-29T20:18:00.000Z',
      id: 'promo_01K1D5A7N2P9R4C6W8YH',
      priceInCents: 329900,
      status: 'APPROVED',
      store: 'AMAZON',
      title: 'Smart TV Samsung Crystal UHD 50"',
    },
    {
      createdAt: '2026-07-29T18:55:00.000Z',
      id: 'promo_01K1D0M8Q5T3V7B2X9ZC',
      priceInCents: 7990,
      status: 'PUBLISHED',
      store: 'MERCADO_LIVRE',
      title: 'Jogo de Toalhas Buddemeyer 5 Peças',
    },
    {
      createdAt: '2026-07-29T17:31:00.000Z',
      id: 'promo_01K1CW7E3R8N6J4S2F5P',
      priceInCents: 45900,
      status: 'FAILED',
      store: 'SHOPEE',
      title: 'Kit Parafusadeira WAP 12V com Maleta',
    },
    {
      createdAt: '2026-07-29T15:09:00.000Z',
      id: 'promo_01K1CP2Y9M4K7D6A3Q8R',
      priceInCents: 24990,
      status: 'PUBLISHED',
      store: 'AMAZON',
      title: 'Echo Pop com Alexa',
    },
  ],
}

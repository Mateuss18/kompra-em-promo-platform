import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PromotionsPage from '@/pages/PromotionsPage.vue'
import { promotionService } from '@/services/promotionService'
import type { Promotion, PromotionPage } from '@/types/promotion'

vi.mock('@/services/promotionService', () => ({
  promotionService: {
    getById: vi.fn<() => Promise<Promotion | null>>(),
    list: vi.fn<() => Promise<PromotionPage>>(),
  },
}))

const promotion: Promotion = {
  affiliateUrl: 'https://amazon.com.br/dp/ECHO?tag=kompra-20',
  couponCode: null,
  createdAt: '2026-07-29T15:09:00.000Z',
  id: 'promo_test',
  message: 'Echo Pop com Alexa.',
  originalPriceInCents: 34990,
  priceInCents: 24990,
  sourceUrl: 'https://amazon.com.br/dp/ECHO',
  status: 'PUBLISHED',
  store: 'AMAZON',
  title: 'Echo Pop com Alexa',
  updatedAt: '2026-07-29T15:22:00.000Z',
}

const promotionPage: PromotionPage = {
  items: [promotion],
  page: 1,
  pageCount: 2,
  total: 6,
}

function mountPromotionsPage() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(PromotionsPage, {
    global: {
      plugins: [pinia],
      stubs: {
        RouterLink: true,
      },
    },
  })
}

describe('PromotionsPage', () => {
  beforeEach(() => {
    vi.mocked(promotionService.list).mockReset()
  })

  it('renders promotions returned by the service', async () => {
    vi.mocked(promotionService.list).mockResolvedValue(promotionPage)

    const wrapper = mountPromotionsPage()
    await flushPromises()

    expect(wrapper.text()).toContain('Echo Pop com Alexa')
    expect(wrapper.text()).toMatch(/R\$\s249,90/)
    expect(wrapper.text()).toContain('Página 1 de 2')
  })

  it('applies search and filters through the store', async () => {
    vi.mocked(promotionService.list).mockResolvedValue(promotionPage)

    const wrapper = mountPromotionsPage()
    await flushPromises()
    await wrapper.get('input[type="search"]').setValue('echo')
    await wrapper.findAll('select')[0]!.setValue('AMAZON')
    await wrapper.findAll('select')[1]!.setValue('PUBLISHED')
    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(promotionService.list).toHaveBeenLastCalledWith(
      expect.objectContaining({
        page: 1,
        search: 'echo',
        status: 'PUBLISHED',
        store: 'AMAZON',
      }),
    )
  })

  it('changes pages through the store', async () => {
    vi.mocked(promotionService.list).mockResolvedValue(promotionPage)

    const wrapper = mountPromotionsPage()
    await flushPromises()
    await wrapper.get('button[aria-label="Próxima página"]').trigger('click')
    await flushPromises()

    expect(promotionService.list).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2 }))
  })

  it('renders empty and error states', async () => {
    vi.mocked(promotionService.list).mockResolvedValueOnce({
      items: [],
      page: 1,
      pageCount: 1,
      total: 0,
    })

    const emptyWrapper = mountPromotionsPage()
    await flushPromises()
    expect(emptyWrapper.text()).toContain('Nenhuma promoção encontrada')
    emptyWrapper.unmount()

    vi.mocked(promotionService.list).mockRejectedValueOnce(new Error('Unavailable'))
    const errorWrapper = mountPromotionsPage()
    await flushPromises()
    expect(errorWrapper.get('[role="alert"]').text()).toContain(
      'Não foi possível carregar as promoções.',
    )
  })
})

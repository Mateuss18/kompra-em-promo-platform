import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import PromotionDetailPage from '@/pages/PromotionDetailPage.vue'
import { promotionService } from '@/services/promotionService'
import type {
  Promotion,
  PromotionPage,
  PromotionWorkflowAction,
  UpdatePromotionInput,
} from '@/types/promotion'

vi.mock('vue-router', async () => ({
  ...(await vi.importActual<typeof import('vue-router')>('vue-router')),
  useRoute: () => ({ params: { id: 'promo_test' } }),
}))

vi.mock('@/services/promotionService', () => ({
  promotionService: {
    getById: vi.fn<() => Promise<Promotion | null>>(),
    list: vi.fn<() => Promise<PromotionPage>>(),
    transition:
      vi.fn<
        (
          id: string,
          action: PromotionWorkflowAction,
          rejectionReason?: string,
        ) => Promise<Promotion | null>
      >(),
    update: vi.fn<(id: string, input: UpdatePromotionInput) => Promise<Promotion | null>>(),
    generateImage:
      vi.fn<() => Promise<{ generatedImageUrl: string; productImageUrl: string | null } | null>>(),
  },
}))

const promotion: Promotion = {
  affiliateUrl: 'https://amazon.com.br/dp/ECHO?tag=kompra-20',
  couponCode: 'ECHO10',
  createdAt: '2026-07-29T15:09:00.000Z',
  generatedImageUrl: null,
  id: 'promo_test',
  message: 'Echo Pop com Alexa.',
  originalPriceInCents: 34990,
  priceInCents: 24990,
  productImageUrl: null,
  sourceUrl: 'https://amazon.com.br/dp/ECHO',
  status: 'DRAFT',
  store: 'AMAZON',
  title: 'Echo Pop com Alexa',
  updatedAt: '2026-07-29T15:22:00.000Z',
}

function mountPromotionDetailPage() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(PromotionDetailPage, {
    global: {
      plugins: [pinia],
      stubs: {
        RouterLink: {
          template: '<a><slot /></a>',
        },
      },
    },
  })
}

describe('PromotionDetailPage', () => {
  beforeEach(() => {
    vi.mocked(promotionService.getById).mockReset()
    vi.mocked(promotionService.transition).mockReset()
    vi.mocked(promotionService.update).mockReset()
    vi.spyOn(window, 'confirm').mockReturnValue(true)
  })

  it('previews, edits and saves promotion content in cents', async () => {
    const savedPromotion: Promotion = {
      ...promotion,
      couponCode: null,
      message: 'Oferta atualizada.',
      originalPriceInCents: null,
      priceInCents: 21990,
      title: 'Echo Pop em oferta',
      updatedAt: '2026-07-30T12:00:00.000Z',
    }

    vi.mocked(promotionService.getById).mockResolvedValue(promotion)
    vi.mocked(promotionService.update).mockResolvedValue(savedPromotion)

    const wrapper = mountPromotionDetailPage()
    await flushPromises()

    await wrapper.get('#promotion-title').setValue('Echo Pop em oferta')
    await wrapper.get('#promotion-message').setValue('Oferta atualizada.')
    await wrapper.get('#promotion-price').setValue('219.90')
    await wrapper.get('#promotion-original-price').setValue('')
    await wrapper.get('#promotion-coupon').setValue('')

    expect(wrapper.get('[aria-labelledby="preview-heading"]').text()).toContain(
      'Echo Pop em oferta',
    )
    expect(wrapper.get('[aria-labelledby="preview-heading"]').text()).toContain('219,90')

    await wrapper.get('form').trigger('submit')
    await flushPromises()

    expect(promotionService.update).toHaveBeenCalledWith('promo_test', {
      couponCode: null,
      message: 'Oferta atualizada.',
      originalPriceInCents: null,
      priceInCents: 21990,
      title: 'Echo Pop em oferta',
    })
    expect(wrapper.get('[role="status"]').text()).toContain('Alterações salvas.')
    expect(wrapper.text()).toContain('30/07/2026')

    await wrapper.get('#promotion-title').setValue('Outra alteração')
    expect(wrapper.find('[role="status"]').exists()).toBe(false)
  })

  it('discards local changes without saving', async () => {
    vi.mocked(promotionService.getById).mockResolvedValue(promotion)

    const wrapper = mountPromotionDetailPage()
    await flushPromises()

    await wrapper.get('#promotion-title').setValue('Título temporário')
    vi.mocked(window.confirm).mockReturnValueOnce(false)
    const discardButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Descartar alterações'))
    await discardButton!.trigger('click')

    expect(wrapper.get<HTMLInputElement>('#promotion-title').element.value).toBe(
      'Título temporário',
    )

    await discardButton!.trigger('click')

    expect(window.confirm).toHaveBeenCalledWith('Descartar todas as alterações não salvas?')
    expect(wrapper.get<HTMLInputElement>('#promotion-title').element.value).toBe(
      'Echo Pop com Alexa',
    )
    expect(promotionService.update).not.toHaveBeenCalled()
  })

  it('approves a promotion ready for review', async () => {
    const readyPromotion: Promotion = { ...promotion, status: 'READY_FOR_REVIEW' }
    const approvedPromotion: Promotion = { ...readyPromotion, status: 'APPROVED' }
    vi.mocked(promotionService.getById).mockResolvedValue(readyPromotion)
    vi.mocked(promotionService.transition).mockResolvedValue(approvedPromotion)

    const wrapper = mountPromotionDetailPage()
    await flushPromises()
    const approveButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Aprovar promoção'))

    expect(approveButton).toBeDefined()
    await approveButton!.trigger('click')
    await flushPromises()

    expect(promotionService.transition).toHaveBeenCalledWith('promo_test', 'APPROVE', undefined)
    expect(wrapper.text()).toContain('Aprovada')
    expect(wrapper.get('[role="status"]').text()).toContain('Status atualizado.')
  })

  it('requires and submits a rejection reason', async () => {
    vi.mocked(promotionService.getById).mockResolvedValue({
      ...promotion,
      status: 'READY_FOR_REVIEW',
    })
    vi.mocked(promotionService.transition).mockResolvedValue({
      ...promotion,
      status: 'REJECTED',
    })

    const wrapper = mountPromotionDetailPage()
    await flushPromises()
    const rejectButton = wrapper
      .findAll('button')
      .find((button) => button.text().includes('Rejeitar promoção'))

    await rejectButton!.trigger('click')
    await wrapper.get('#rejection-reason').setValue('Preço incorreto.')
    await wrapper
      .get('#rejection-reason')
      .element.closest('form')!
      .dispatchEvent(new Event('submit'))
    await flushPromises()

    expect(promotionService.transition).toHaveBeenCalledWith(
      'promo_test',
      'REJECT',
      'Preço incorreto.',
    )
  })
})

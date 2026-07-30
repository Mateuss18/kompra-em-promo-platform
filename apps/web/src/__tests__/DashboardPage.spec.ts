import { flushPromises, mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import DashboardPage from '@/pages/DashboardPage.vue'
import { dashboardService } from '@/services/dashboardService'
import type { DashboardData } from '@/types/dashboard'

vi.mock('@/services/dashboardService', () => ({
  dashboardService: {
    getDashboard: vi.fn<() => Promise<DashboardData>>(),
  },
}))

const dashboardData: DashboardData = {
  indicators: {
    approved: 3,
    drafts: 5,
    errors: 1,
    published: 8,
  },
  recentPromotions: [
    {
      createdAt: '2026-07-29T18:30:00.000Z',
      id: 'promo_test',
      priceInCents: 12990,
      status: 'APPROVED',
      store: 'AMAZON',
      title: 'Echo Pop com Alexa',
    },
  ],
}

function mountDashboard() {
  const pinia = createPinia()
  setActivePinia(pinia)

  return mount(DashboardPage, {
    global: {
      plugins: [pinia],
    },
  })
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.mocked(dashboardService.getDashboard).mockReset()
  })

  it('shows loading while dashboard data is pending', () => {
    vi.mocked(dashboardService.getDashboard).mockReturnValue(new Promise(() => undefined))

    const wrapper = mountDashboard()

    expect(wrapper.get('[role="status"]').text()).toContain('Carregando dashboard')
  })

  it('renders summary cards and recent promotions', async () => {
    vi.mocked(dashboardService.getDashboard).mockResolvedValue(dashboardData)

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.get('[aria-label="Resumo das promoções"]').text()).toContain('Rascunhos5')
    expect(wrapper.get('[aria-label="Resumo das promoções"]').text()).toContain('Publicadas8')
    expect(wrapper.text()).toContain('Echo Pop com Alexa')
    expect(wrapper.text()).toMatch(/R\$\s129,90/)
    expect(wrapper.text()).toContain('Aprovada')
  })

  it('shows the empty state when there are no recent promotions', async () => {
    vi.mocked(dashboardService.getDashboard).mockResolvedValue({
      ...dashboardData,
      recentPromotions: [],
    })

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.text()).toContain('Nenhuma promoção em acompanhamento')
    expect(wrapper.text()).toContain('0 registros')
  })

  it('shows an error and retries loading', async () => {
    vi.mocked(dashboardService.getDashboard)
      .mockRejectedValueOnce(new Error('Unavailable'))
      .mockResolvedValueOnce(dashboardData)

    const wrapper = mountDashboard()
    await flushPromises()

    expect(wrapper.get('[role="alert"]').text()).toContain('Não foi possível carregar o dashboard.')

    await wrapper.get('button').trigger('click')
    await flushPromises()

    expect(wrapper.text()).toContain('Echo Pop com Alexa')
    expect(dashboardService.getDashboard).toHaveBeenCalledTimes(2)
  })
})

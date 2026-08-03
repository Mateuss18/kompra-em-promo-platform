import { promotionService } from '@/services/promotionService'
import type { DashboardData, RecentPromotion } from '@/types/dashboard'

const RECENT_PROMOTION_LIMIT = 5

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    const { items } = await promotionService.list({
      page: 1,
      pageSize: 9999,
      search: '',
      sort: 'NEWEST',
      status: 'ALL',
      store: 'ALL',
    })

    const recentPromotions: RecentPromotion[] = items
      .slice(0, RECENT_PROMOTION_LIMIT)
      .map((promotion): RecentPromotion => ({
        createdAt: promotion.createdAt,
        id: promotion.id,
        priceInCents: promotion.priceInCents,
        status: promotion.status,
        store: promotion.store,
        title: promotion.title,
      }))

    return {
      indicators: {
        approved: items.filter((promotion) => promotion.status === 'APPROVED').length,
        drafts: items.filter((promotion) => promotion.status === 'DRAFT').length,
        errors: items.filter((promotion) => promotion.status === 'FAILED').length,
        published: items.filter((promotion) => promotion.status === 'PUBLISHED').length,
      },
      recentPromotions,
    }
  },
}

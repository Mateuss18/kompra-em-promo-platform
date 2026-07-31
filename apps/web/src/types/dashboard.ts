import type { Promotion } from '@/types/promotion'

export interface DashboardIndicators {
  approved: number
  drafts: number
  errors: number
  published: number
}

export type RecentPromotion = Pick<
  Promotion,
  'createdAt' | 'id' | 'priceInCents' | 'status' | 'store' | 'title'
>

export interface DashboardData {
  indicators: DashboardIndicators
  recentPromotions: RecentPromotion[]
}

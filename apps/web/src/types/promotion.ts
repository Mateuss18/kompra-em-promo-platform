export type PromotionStore = 'AMAZON' | 'MERCADO_LIVRE' | 'SHOPEE'

export type PromotionStatus =
  | 'APPROVED'
  | 'DRAFT'
  | 'FAILED'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'PUBLISHING'
  | 'READY_FOR_REVIEW'
  | 'REJECTED'

export type PromotionSort = 'NEWEST' | 'OLDEST' | 'PRICE_ASC' | 'PRICE_DESC'

export interface Promotion {
  affiliateUrl: string
  couponCode: string | null
  createdAt: string
  id: string
  message: string
  originalPriceInCents: number | null
  priceInCents: number
  sourceUrl: string
  status: PromotionStatus
  store: PromotionStore
  title: string
  updatedAt: string
}

export interface PromotionFilters {
  page: number
  pageSize: number
  search: string
  sort: PromotionSort
  status: PromotionStatus | 'ALL'
  store: PromotionStore | 'ALL'
}

export interface PromotionPage {
  items: Promotion[]
  page: number
  pageCount: number
  total: number
}

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

export type PromotionWorkflowAction = 'APPROVE' | 'PUBLISH' | 'REJECT' | 'SUBMIT_FOR_REVIEW'

export interface PromotionEvent {
  action: PromotionWorkflowAction
  actor: 'ADMIN'
  createdAt: string
  fromStatus: PromotionStatus
  id: string
  reason: string | null
  toStatus: PromotionStatus
}

export interface Promotion {
  affiliateUrl: string
  couponCode: string | null
  createdAt: string
  events?: PromotionEvent[]
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

export type UpdatePromotionInput = Pick<
  Promotion,
  'couponCode' | 'message' | 'originalPriceInCents' | 'priceInCents' | 'title'
>

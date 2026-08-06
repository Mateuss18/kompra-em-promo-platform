import type { PromotionStore } from '../../../generated/prisma/client.js'

export type ParsedProduct = {
  title: string
  priceInCents: number
  imageUrl: string | null
}

export interface StoreParser {
  readonly store: PromotionStore
  canHandle(url: string): boolean
  normalizeAffiliateUrl(url: string): string
  parse(url: string): ParsedProduct
}

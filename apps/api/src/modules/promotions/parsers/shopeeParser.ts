import { PromotionStore } from '../../../generated/prisma/client.js'
import type { StoreParser } from './types.js'

const isDomain = (hostname: string, domain: string) =>
  hostname === domain || hostname.endsWith(`.${domain}`)

const isShopeeHostname = (hostname: string) =>
  isDomain(hostname, 'shopee.com.br') || isDomain(hostname, 'shopee.com')

export const shopeeParser: StoreParser = {
  store: PromotionStore.SHOPEE,

  canHandle(url: string) {
    try {
      return isShopeeHostname(new URL(url).hostname.toLowerCase())
    } catch {
      return false
    }
  },

  normalizeAffiliateUrl(url: string) {
    const parsed = new URL(url)
    const affiliateId = parsed.searchParams.get('affiliate_id')
    if (!affiliateId) return url
    return parsed.toString()
  },

  parse() {
    return {
      title: 'Produto Shopee',
      priceInCents: 1_000,
      imageUrl: null,
    }
  },
}

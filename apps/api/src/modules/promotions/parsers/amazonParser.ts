import { PromotionStore } from '../../../generated/prisma/client.js'
import type { StoreParser } from './types.js'

const isDomain = (hostname: string, domain: string) =>
  hostname === domain || hostname.endsWith(`.${domain}`)

const isAmazonHostname = (hostname: string) =>
  isDomain(hostname, 'amazon.com') || isDomain(hostname, 'amazon.com.br') || hostname === 'amzn.to'

export const amazonParser: StoreParser = {
  store: PromotionStore.AMAZON,

  canHandle(url: string) {
    try {
      return isAmazonHostname(new URL(url).hostname.toLowerCase())
    } catch {
      return false
    }
  },

  normalizeAffiliateUrl(url: string) {
    const parsed = new URL(url)
    const tag = parsed.searchParams.get('tag')
    if (!tag) return url
    return parsed.toString()
  },

  parse() {
    return {
      title: 'Produto Amazon',
      priceInCents: 1_000,
      imageUrl: null,
    }
  },
}

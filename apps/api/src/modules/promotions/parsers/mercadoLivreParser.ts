import { PromotionStore } from '../../../generated/prisma/client.js'
import type { StoreParser } from './types.js'

const isDomain = (hostname: string, domain: string) =>
  hostname === domain || hostname.endsWith(`.${domain}`)

const isMercadoLivreHostname = (hostname: string) =>
  isDomain(hostname, 'mercadolivre.com.br') ||
  isDomain(hostname, 'mercadolibre.com.br') ||
  isDomain(hostname, 'mercadolibre.com') ||
  hostname === 'meli.la'

export const mercadoLivreParser: StoreParser = {
  store: PromotionStore.MERCADO_LIVRE,

  canHandle(url: string) {
    try {
      return isMercadoLivreHostname(new URL(url).hostname.toLowerCase())
    } catch {
      return false
    }
  },

  normalizeAffiliateUrl(url: string) {
    const parsed = new URL(url)
    const mattTool = parsed.searchParams.get('matt_tool')
    if (!mattTool) return url
    return parsed.toString()
  },

  parse() {
    return {
      title: 'Produto Mercado Livre',
      priceInCents: 1_000,
      imageUrl: null,
    }
  },
}

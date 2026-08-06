import { promotionsMock } from '@/mocks/promotions'
import { getAccessToken } from '@/services/authService'
import type {
  Promotion,
  PromotionEvent,
  PromotionFilters,
  PromotionPage,
  PromotionStatus,
  PromotionStore,
  PromotionWorkflowAction,
  UpdatePromotionInput,
} from '@/types/promotion'

const STORAGE_KEY = 'kompra-em-promo:promotions'
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')
const usesApi = () => Boolean(API_URL && getAccessToken())
const PROMOTION_STATUSES = new Set<PromotionStatus>([
  'APPROVED',
  'DRAFT',
  'FAILED',
  'PROCESSING',
  'PUBLISHED',
  'PUBLISHING',
  'READY_FOR_REVIEW',
  'REJECTED',
])
const PROMOTION_STORES = new Set<PromotionStore>(['AMAZON', 'MERCADO_LIVRE', 'SHOPEE'])
const WORKFLOW_ACTIONS = new Set<PromotionWorkflowAction>([
  'APPROVE',
  'PUBLISH',
  'REJECT',
  'SUBMIT_FOR_REVIEW',
])
const TRANSITIONS: Record<
  PromotionWorkflowAction,
  { fromStatus: PromotionStatus; toStatus: PromotionStatus }
> = {
  APPROVE: { fromStatus: 'READY_FOR_REVIEW', toStatus: 'APPROVED' },
  PUBLISH: { fromStatus: 'APPROVED', toStatus: 'PUBLISHED' },
  REJECT: { fromStatus: 'READY_FOR_REVIEW', toStatus: 'REJECTED' },
  SUBMIT_FOR_REVIEW: { fromStatus: 'DRAFT', toStatus: 'READY_FOR_REVIEW' },
}

const isDomain = (hostname: string, domain: string) =>
  hostname === domain || hostname.endsWith(`.${domain}`)

const CANVAS_SIZE = 1080
const LOGO_WIDTH = 320
const LOGO_HEIGHT = 80
const LOGO_PADDING = 40
const BRAND_BACKGROUND = '#00d992'
const BRAND_TEXT = '#101010'
const PLACEHOLDER_BACKGROUND = '#101010'

function drawPlaceholderBackground(context: CanvasRenderingContext2D) {
  context.fillStyle = PLACEHOLDER_BACKGROUND
  context.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)
}

function drawLogo(context: CanvasRenderingContext2D) {
  context.fillStyle = BRAND_BACKGROUND
  context.globalAlpha = 0.95
  roundRect(context, LOGO_PADDING, LOGO_PADDING, LOGO_WIDTH, LOGO_HEIGHT, 8)
  context.fill()
  context.globalAlpha = 1

  context.fillStyle = BRAND_TEXT
  context.font = '700 24px system-ui, sans-serif'
  context.textAlign = 'center'
  context.textBaseline = 'middle'
  context.fillText('KOMPRA EM PROMO', LOGO_PADDING + LOGO_WIDTH / 2, LOGO_PADDING + LOGO_HEIGHT / 2)
}

function roundRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath()
  context.moveTo(x + radius, y)
  context.lineTo(x + width - radius, y)
  context.quadraticCurveTo(x + width, y, x + width, y + radius)
  context.lineTo(x + width, y + height - radius)
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  context.lineTo(x + radius, y + height)
  context.quadraticCurveTo(x, y + height, x, y + height - radius)
  context.lineTo(x, y + radius)
  context.quadraticCurveTo(x, y, x + radius, y)
  context.closePath()
}

function drawGeneratedImage(canvas: HTMLCanvasElement): string {
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Canvas context not available')

  drawPlaceholderBackground(context)
  drawLogo(context)

  return canvas.toDataURL('image/png')
}

function generateLocalPromotionImage(): string {
  const canvas = document.createElement('canvas')
  canvas.width = CANVAS_SIZE
  canvas.height = CANVAS_SIZE

  return drawGeneratedImage(canvas)
}

function detectStore(url: string): PromotionStore {
  const parsedUrl = new URL(url)
  const hostname = parsedUrl.hostname.toLowerCase()

  if (!['http:', 'https:'].includes(parsedUrl.protocol)) throw new Error('Invalid URL')
  if (isDomain(hostname, 'shopee.com.br') || isDomain(hostname, 'shopee.com')) return 'SHOPEE'
  if (
    isDomain(hostname, 'amazon.com.br') ||
    isDomain(hostname, 'amazon.com') ||
    hostname === 'amzn.to'
  ) {
    return 'AMAZON'
  }
  if (
    isDomain(hostname, 'mercadolivre.com.br') ||
    isDomain(hostname, 'mercadolibre.com.br') ||
    isDomain(hostname, 'mercadolibre.com') ||
    hostname === 'meli.la'
  ) {
    return 'MERCADO_LIVRE'
  }

  throw new Error('Unsupported store')
}

function isPromotionEvent(value: unknown): value is PromotionEvent {
  if (!value || typeof value !== 'object') return false

  const event = value as Record<string, unknown>

  return (
    typeof event.action === 'string' &&
    WORKFLOW_ACTIONS.has(event.action as PromotionWorkflowAction) &&
    event.actor === 'ADMIN' &&
    typeof event.createdAt === 'string' &&
    typeof event.fromStatus === 'string' &&
    PROMOTION_STATUSES.has(event.fromStatus as PromotionStatus) &&
    typeof event.id === 'string' &&
    (event.reason === null || typeof event.reason === 'string') &&
    typeof event.toStatus === 'string' &&
    PROMOTION_STATUSES.has(event.toStatus as PromotionStatus)
  )
}

function isPromotion(value: unknown): value is Promotion {
  if (!value || typeof value !== 'object') return false

  const promotion = value as Record<string, unknown>

  return (
    typeof promotion.affiliateUrl === 'string' &&
    (promotion.couponCode === null || typeof promotion.couponCode === 'string') &&
    typeof promotion.createdAt === 'string' &&
    (promotion.events === undefined ||
      (Array.isArray(promotion.events) && promotion.events.every(isPromotionEvent))) &&
    (promotion.generatedImageUrl === null || typeof promotion.generatedImageUrl === 'string') &&
    typeof promotion.id === 'string' &&
    typeof promotion.message === 'string' &&
    (promotion.originalPriceInCents === null ||
      typeof promotion.originalPriceInCents === 'number') &&
    typeof promotion.priceInCents === 'number' &&
    (promotion.productImageUrl === null || typeof promotion.productImageUrl === 'string') &&
    typeof promotion.sourceUrl === 'string' &&
    typeof promotion.status === 'string' &&
    PROMOTION_STATUSES.has(promotion.status as PromotionStatus) &&
    typeof promotion.store === 'string' &&
    PROMOTION_STORES.has(promotion.store as PromotionStore) &&
    typeof promotion.title === 'string' &&
    typeof promotion.updatedAt === 'string'
  )
}

function readPromotions(): Promotion[] {
  const storedPromotions = localStorage.getItem(STORAGE_KEY)
  if (!storedPromotions) return structuredClone(promotionsMock)

  try {
    const parsed: unknown = JSON.parse(storedPromotions)
    return Array.isArray(parsed) && parsed.every(isPromotion)
      ? parsed
      : structuredClone(promotionsMock)
  } catch {
    return structuredClone(promotionsMock)
  }
}

function parsePromotion(value: unknown): Promotion {
  if (!isPromotion(value)) throw new Error('Invalid promotion response')
  return value
}

function parsePromotionPage(value: unknown): PromotionPage {
  if (
    !value ||
    typeof value !== 'object' ||
    !('items' in value) ||
    !Array.isArray(value.items) ||
    !value.items.every(isPromotion) ||
    !('page' in value) ||
    typeof value.page !== 'number' ||
    !('pageCount' in value) ||
    typeof value.pageCount !== 'number' ||
    !('total' in value) ||
    typeof value.total !== 'number'
  ) {
    throw new Error('Invalid promotion response')
  }

  return value as PromotionPage
}

async function request(path: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers)
  const accessToken = getAccessToken()

  if (options.body) headers.set('Content-Type', 'application/json')
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`)

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!response.ok && response.status !== 404) {
    throw Object.assign(new Error('Promotion request failed'), { status: response.status })
  }

  return response
}

export const promotionService = {
  async createFromUrl(url: string): Promise<Promotion> {
    if (usesApi()) {
      const response = await request('/api/promotions/ingest', {
        method: 'POST',
        body: JSON.stringify({ url }),
      })
      return parsePromotion(await response.json())
    }

    const sourceUrl = url.trim()
    const store = detectStore(sourceUrl)
    const createdAt = new Date().toISOString()
    const promotion: Promotion = {
      affiliateUrl: sourceUrl,
      couponCode: null,
      createdAt,
      generatedImageUrl: null,
      id: crypto.randomUUID(),
      message: 'Rascunho criado a partir do link. Edite o conteúdo antes de enviar para revisão.',
      originalPriceInCents: null,
      priceInCents: 1000,
      productImageUrl: null,
      sourceUrl,
      status: 'DRAFT',
      store,
      title: 'Nova promoção',
      updatedAt: createdAt,
    }

    const promotions = readPromotions()
    promotions.unshift(promotion)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions))

    return structuredClone(promotion)
  },

  async getById(id: string): Promise<Promotion | null> {
    if (usesApi()) {
      const response = await request(`/api/promotions/${encodeURIComponent(id)}`)
      return response.status === 404 ? null : parsePromotion(await response.json())
    }

    return structuredClone(readPromotions().find((promotion) => promotion.id === id) ?? null)
  },

  async list(filters: PromotionFilters): Promise<PromotionPage> {
    if (usesApi()) {
      const query = new URLSearchParams({
        page: String(filters.page),
        pageSize: String(filters.pageSize),
        search: filters.search,
        sort: filters.sort,
        status: filters.status,
        store: filters.store,
      })
      return parsePromotionPage(await (await request(`/api/promotions?${query}`)).json())
    }

    const search = filters.search.trim().toLocaleLowerCase('pt-BR')
    const items = readPromotions().filter(
      (promotion) =>
        (!search || promotion.title.toLocaleLowerCase('pt-BR').includes(search)) &&
        (filters.status === 'ALL' || promotion.status === filters.status) &&
        (filters.store === 'ALL' || promotion.store === filters.store),
    )

    items.sort((left, right) => {
      if (filters.sort === 'PRICE_ASC') return left.priceInCents - right.priceInCents
      if (filters.sort === 'PRICE_DESC') return right.priceInCents - left.priceInCents
      if (filters.sort === 'OLDEST') return left.createdAt.localeCompare(right.createdAt)
      return right.createdAt.localeCompare(left.createdAt)
    })

    const total = items.length
    const pageCount = Math.max(1, Math.ceil(total / filters.pageSize))
    const page = Math.min(filters.page, pageCount)
    const start = (page - 1) * filters.pageSize

    return structuredClone({
      items: items.slice(start, start + filters.pageSize),
      page,
      pageCount,
      total,
    })
  },

  async update(id: string, input: UpdatePromotionInput): Promise<Promotion | null> {
    if (usesApi()) {
      const response = await request(`/api/promotions/${encodeURIComponent(id)}`, {
        method: 'PATCH',
        body: JSON.stringify(input),
      })
      return response.status === 404 ? null : parsePromotion(await response.json())
    }

    const title = input.title.trim()
    const message = input.message.trim()
    const pricesAreValid =
      Number.isInteger(input.priceInCents) &&
      input.priceInCents > 0 &&
      (input.originalPriceInCents === null ||
        (Number.isInteger(input.originalPriceInCents) && input.originalPriceInCents > 0))

    if (!title || !message || !pricesAreValid) {
      throw new Error('Invalid promotion content')
    }

    const promotions = readPromotions()
    const index = promotions.findIndex((promotion) => promotion.id === id)
    if (index === -1) return null
    if (!['DRAFT', 'READY_FOR_REVIEW'].includes(promotions[index]!.status)) {
      throw new Error('Promotion content cannot be edited in its current status')
    }

    const updatedPromotion: Promotion = {
      ...promotions[index]!,
      ...input,
      couponCode: input.couponCode?.trim() || null,
      message,
      title,
      updatedAt: new Date().toISOString(),
    }

    promotions[index] = updatedPromotion
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions))

    return structuredClone(updatedPromotion)
  },

  async generateImage(
    id: string,
  ): Promise<Pick<Promotion, 'generatedImageUrl' | 'productImageUrl'> | null> {
    if (usesApi()) {
      const response = await request(`/api/promotions/${encodeURIComponent(id)}/generate-image`, {
        method: 'POST',
      })
      if (response.status === 404) return null

      const body: unknown = await response.json()
      if (
        !body ||
        typeof body !== 'object' ||
        !('generatedImageUrl' in body) ||
        typeof body.generatedImageUrl !== 'string'
      ) {
        throw new Error('Invalid image generation response')
      }

      return { generatedImageUrl: body.generatedImageUrl, productImageUrl: null }
    }

    const promotions = readPromotions()
    const index = promotions.findIndex((promotion) => promotion.id === id)
    if (index === -1) return null

    const generatedImageUrl = generateLocalPromotionImage()
    promotions[index] = {
      ...promotions[index]!,
      generatedImageUrl,
      updatedAt: new Date().toISOString(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions))

    return { generatedImageUrl, productImageUrl: promotions[index]!.productImageUrl }
  },

  async transition(
    id: string,
    action: PromotionWorkflowAction,
    rejectionReason?: string,
  ): Promise<Promotion | null> {
    if (usesApi()) {
      const response = await request(`/api/promotions/${encodeURIComponent(id)}/transitions`, {
        method: 'POST',
        body: JSON.stringify({ action, rejectionReason }),
      })
      return response.status === 404 ? null : parsePromotion(await response.json())
    }

    const promotions = readPromotions()
    const index = promotions.findIndex((promotion) => promotion.id === id)
    if (index === -1) return null

    const promotion = promotions[index]!
    const transition = TRANSITIONS[action]
    if (promotion.status !== transition.fromStatus) {
      throw new Error('Invalid promotion transition')
    }

    const reason = rejectionReason?.trim() || null
    if (action === 'REJECT' && !reason) {
      throw new Error('Rejection reason is required')
    }

    const createdAt = new Date().toISOString()
    const event: PromotionEvent = {
      action,
      actor: 'ADMIN',
      createdAt,
      fromStatus: promotion.status,
      id: `${promotion.id}:${createdAt}:${promotion.events?.length ?? 0}`,
      reason: action === 'REJECT' ? reason : null,
      toStatus: transition.toStatus,
    }
    const updatedPromotion: Promotion = {
      ...promotion,
      events: [...(promotion.events ?? []), event],
      status: transition.toStatus,
      updatedAt: createdAt,
    }

    promotions[index] = updatedPromotion
    localStorage.setItem(STORAGE_KEY, JSON.stringify(promotions))

    return structuredClone(updatedPromotion)
  },
}

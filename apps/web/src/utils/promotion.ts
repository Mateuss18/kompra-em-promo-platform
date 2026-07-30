import type { PromotionStatus, PromotionStore } from '@/types/promotion'

export const PROMOTION_STATUS_LABELS: Record<PromotionStatus, string> = {
  APPROVED: 'Aprovada',
  DRAFT: 'Rascunho',
  FAILED: 'Falha',
  PROCESSING: 'Processando',
  PUBLISHED: 'Publicada',
  PUBLISHING: 'Publicando',
  READY_FOR_REVIEW: 'Pronta para revisão',
  REJECTED: 'Rejeitada',
}

export const PROMOTION_STORE_LABELS: Record<PromotionStore, string> = {
  AMAZON: 'Amazon',
  MERCADO_LIVRE: 'Mercado Livre',
  SHOPEE: 'Shopee',
}

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})
const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
})

export function formatCurrency(valueInCents: number) {
  return currencyFormatter.format(valueInCents / 100)
}

export function formatDateTime(value: string) {
  return dateFormatter.format(new Date(value))
}

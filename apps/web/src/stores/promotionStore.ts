import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

import { promotionService } from '@/services/promotionService'
import type { Promotion, PromotionSort, PromotionStatus, PromotionStore } from '@/types/promotion'

const PAGE_SIZE = 5

export const usePromotionStore = defineStore('promotion', () => {
  const errorMessage = shallowRef('')
  const isLoading = shallowRef(true)
  const page = shallowRef(1)
  const pageCount = shallowRef(1)
  const promotions = shallowRef<Promotion[]>([])
  const search = shallowRef('')
  const selectedPromotion = shallowRef<Promotion | null>(null)
  const sort = shallowRef<PromotionSort>('NEWEST')
  const status = shallowRef<PromotionStatus | 'ALL'>('ALL')
  const store = shallowRef<PromotionStore | 'ALL'>('ALL')
  const total = shallowRef(0)

  async function loadPromotions() {
    isLoading.value = true
    errorMessage.value = ''

    try {
      const result = await promotionService.list({
        page: page.value,
        pageSize: PAGE_SIZE,
        search: search.value,
        sort: sort.value,
        status: status.value,
        store: store.value,
      })
      promotions.value = result.items
      page.value = result.page
      pageCount.value = result.pageCount
      total.value = result.total
    } catch {
      promotions.value = []
      errorMessage.value = 'Não foi possível carregar as promoções.'
    } finally {
      isLoading.value = false
    }
  }

  async function applyFilters() {
    page.value = 1
    await loadPromotions()
  }

  async function changePage(nextPage: number) {
    if (nextPage < 1 || nextPage > pageCount.value) return

    page.value = nextPage
    await loadPromotions()
  }

  async function loadPromotion(id: string) {
    isLoading.value = true
    errorMessage.value = ''
    selectedPromotion.value = null

    try {
      selectedPromotion.value = await promotionService.getById(id)
    } catch {
      errorMessage.value = 'Não foi possível carregar a promoção.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    applyFilters,
    changePage,
    errorMessage,
    isLoading,
    loadPromotion,
    loadPromotions,
    page,
    pageCount,
    promotions,
    search,
    selectedPromotion,
    sort,
    status,
    store,
    total,
  }
})

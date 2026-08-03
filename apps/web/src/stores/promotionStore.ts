import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

import { promotionService } from '@/services/promotionService'
import type {
  Promotion,
  PromotionSort,
  PromotionStatus,
  PromotionStore,
  PromotionWorkflowAction,
  UpdatePromotionInput,
} from '@/types/promotion'

const PAGE_SIZE = 5

export const usePromotionStore = defineStore('promotion', () => {
  const createFromUrlErrorMessage = shallowRef('')
  const errorMessage = shallowRef('')
  const isCreatingFromUrl = shallowRef(false)
  const isLoading = shallowRef(true)
  const isSaving = shallowRef(false)
  const isTransitioning = shallowRef(false)
  const page = shallowRef(1)
  const pageCount = shallowRef(1)
  const promotions = shallowRef<Promotion[]>([])
  const saveErrorMessage = shallowRef('')
  const search = shallowRef('')
  const selectedPromotion = shallowRef<Promotion | null>(null)
  const sort = shallowRef<PromotionSort>('NEWEST')
  const status = shallowRef<PromotionStatus | 'ALL'>('ALL')
  const store = shallowRef<PromotionStore | 'ALL'>('ALL')
  const total = shallowRef(0)
  const transitionErrorMessage = shallowRef('')

  async function createFromUrl(url: string): Promise<string | null> {
    isCreatingFromUrl.value = true
    createFromUrlErrorMessage.value = ''

    try {
      const promotion = await promotionService.createFromUrl(url)
      return promotion.id
    } catch {
      createFromUrlErrorMessage.value =
        'Não foi possível criar o rascunho. Verifique o link e tente novamente.'
      return null
    } finally {
      isCreatingFromUrl.value = false
    }
  }

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
    transitionErrorMessage.value = ''
    selectedPromotion.value = null

    try {
      selectedPromotion.value = await promotionService.getById(id)
    } catch {
      errorMessage.value = 'Não foi possível carregar a promoção.'
    } finally {
      isLoading.value = false
    }
  }

  async function savePromotion(input: UpdatePromotionInput) {
    if (!selectedPromotion.value) return false

    isSaving.value = true
    saveErrorMessage.value = ''

    try {
      const updatedPromotion = await promotionService.update(selectedPromotion.value.id, input)

      if (!updatedPromotion) {
        saveErrorMessage.value = 'A promoção não está mais disponível.'
        return false
      }

      selectedPromotion.value = updatedPromotion
      return true
    } catch {
      saveErrorMessage.value = 'Não foi possível salvar as alterações.'
      return false
    } finally {
      isSaving.value = false
    }
  }

  async function transitionPromotion(action: PromotionWorkflowAction, rejectionReason?: string) {
    if (!selectedPromotion.value) return false

    isTransitioning.value = true
    transitionErrorMessage.value = ''

    try {
      const updatedPromotion = await promotionService.transition(
        selectedPromotion.value.id,
        action,
        rejectionReason,
      )

      if (!updatedPromotion) {
        transitionErrorMessage.value = 'A promoção não está mais disponível.'
        return false
      }

      selectedPromotion.value = updatedPromotion
      return true
    } catch {
      transitionErrorMessage.value = 'Não foi possível alterar o status da promoção.'
      return false
    } finally {
      isTransitioning.value = false
    }
  }

  return {
    applyFilters,
    changePage,
    createFromUrl,
    createFromUrlErrorMessage,
    errorMessage,
    isCreatingFromUrl,
    isLoading,
    isSaving,
    isTransitioning,
    loadPromotion,
    loadPromotions,
    page,
    pageCount,
    promotions,
    saveErrorMessage,
    savePromotion,
    search,
    selectedPromotion,
    sort,
    status,
    store,
    total,
    transitionErrorMessage,
    transitionPromotion,
  }
})

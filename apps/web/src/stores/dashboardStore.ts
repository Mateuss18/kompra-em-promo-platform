import { defineStore } from 'pinia'
import { shallowRef } from 'vue'

import { dashboardService } from '@/services/dashboardService'
import type { DashboardData } from '@/types/dashboard'

export const useDashboardStore = defineStore('dashboard', () => {
  const data = shallowRef<DashboardData | null>(null)
  const errorMessage = shallowRef('')
  const isLoading = shallowRef(true)

  async function loadDashboard() {
    isLoading.value = true
    errorMessage.value = ''

    try {
      data.value = await dashboardService.getDashboard()
    } catch {
      data.value = null
      errorMessage.value = 'Não foi possível carregar o dashboard.'
    } finally {
      isLoading.value = false
    }
  }

  return { data, errorMessage, isLoading, loadDashboard }
})

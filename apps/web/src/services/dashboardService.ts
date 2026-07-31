import { dashboardMock } from '@/mocks/dashboard'
import type { DashboardData } from '@/types/dashboard'

export const dashboardService = {
  async getDashboard(): Promise<DashboardData> {
    return structuredClone(dashboardMock)
  },
}

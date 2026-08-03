<script setup lang="ts">
import { BadgeCheck, FilePenLine, Send, TriangleAlert } from '@lucide/vue'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

import DashboardLinkInput from '@/components/dashboard/DashboardLinkInput.vue'
import DashboardRecentPromotions from '@/components/dashboard/DashboardRecentPromotions.vue'
import DashboardSummaryCard from '@/components/dashboard/DashboardSummaryCard.vue'
import { useDashboardStore } from '@/stores/dashboardStore'
import { usePromotionStore } from '@/stores/promotionStore'

const dashboardStore = useDashboardStore()
const promotionStore = usePromotionStore()
const router = useRouter()

onMounted(() => {
  void dashboardStore.loadDashboard()
})

async function createPromotion(url: string) {
  const id = await promotionStore.createFromUrl(url)
  if (!id) return

  await dashboardStore.loadDashboard()
  await router.push({ name: 'promotion-details', params: { id } })
}
</script>

<template>
  <div class="animate-[dashboard-in_320ms_ease-out]">
    <header class="max-w-2xl">
      <p class="text-brand m-0 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
        Dashboard
      </p>
      <h1
        class="text-ink-strong mt-3 mb-0 text-3xl leading-tight font-normal tracking-[-0.04em] md:text-4xl"
      >
        Visão geral
      </h1>
      <p class="text-body mt-3 mb-0 text-base leading-7">
        Acompanhe os rascunhos, aprovações e publicações em um só lugar.
      </p>
    </header>

    <DashboardLinkInput
      :is-creating="promotionStore.isCreatingFromUrl"
      :error-message="promotionStore.createFromUrlErrorMessage"
      @submit="createPromotion"
    />

    <div v-if="dashboardStore.isLoading" role="status" class="mt-12" aria-live="polite">
      <span class="sr-only">Carregando dashboard</span>
      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div
          v-for="item in 4"
          :key="item"
          class="border-hairline bg-canvas-soft h-32 animate-pulse rounded-md border"
        />
      </div>
      <div class="border-hairline bg-canvas-soft mt-12 h-64 animate-pulse border-y" />
    </div>

    <div
      v-else-if="dashboardStore.errorMessage"
      role="alert"
      class="border-hairline mt-12 flex min-h-64 flex-col items-center justify-center rounded-md border px-6 py-12 text-center"
    >
      <span
        class="border-hairline text-muted grid size-12 place-items-center rounded-full border"
        aria-hidden="true"
      >
        <TriangleAlert :size="22" />
      </span>
      <h2 class="text-ink-strong mt-5 mb-0 text-base font-semibold">
        Falha ao carregar o dashboard
      </h2>
      <p class="text-body mt-2 mb-0 text-sm leading-6">{{ dashboardStore.errorMessage }}</p>
      <button
        type="button"
        class="bg-brand text-canvas hover:bg-brand-soft mt-6 min-h-11 cursor-pointer rounded-sm border-0 px-4 text-sm font-semibold transition-colors"
        @click="dashboardStore.loadDashboard"
      >
        Tentar novamente
      </button>
    </div>

    <template v-else-if="dashboardStore.data">
      <section
        class="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Resumo das promoções"
      >
        <DashboardSummaryCard
          label="Rascunhos"
          :value="dashboardStore.data.indicators.drafts"
          :icon="FilePenLine"
        />
        <DashboardSummaryCard
          label="Aprovadas"
          :value="dashboardStore.data.indicators.approved"
          :icon="BadgeCheck"
        />
        <DashboardSummaryCard
          label="Publicadas"
          :value="dashboardStore.data.indicators.published"
          :icon="Send"
        />
        <DashboardSummaryCard
          label="Erros"
          :value="dashboardStore.data.indicators.errors"
          :icon="TriangleAlert"
        />
      </section>

      <DashboardRecentPromotions :promotions="dashboardStore.data.recentPromotions" />
    </template>
  </div>
</template>

<style scoped>
@keyframes dashboard-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>

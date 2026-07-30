<script setup lang="ts">
import { SearchX, TriangleAlert } from '@lucide/vue'
import { onMounted } from 'vue'

import PromotionFilters from '@/components/promotions/PromotionFilters.vue'
import PromotionPagination from '@/components/promotions/PromotionPagination.vue'
import PromotionTable from '@/components/promotions/PromotionTable.vue'
import { usePromotionStore } from '@/stores/promotionStore'

const promotionStore = usePromotionStore()

onMounted(() => {
  void promotionStore.loadPromotions()
})
</script>

<template>
  <section class="mt-10" aria-label="Gestão de promoções">
    <PromotionFilters
      v-model:search="promotionStore.search"
      v-model:sort="promotionStore.sort"
      v-model:status="promotionStore.status"
      v-model:store="promotionStore.store"
      @submit="promotionStore.applyFilters"
    />

    <div v-if="promotionStore.isLoading" role="status" class="mt-6" aria-live="polite">
      <span class="sr-only">Carregando promoções</span>
      <div class="border-hairline bg-canvas-soft h-96 animate-pulse rounded-md border" />
    </div>

    <div
      v-else-if="promotionStore.errorMessage"
      role="alert"
      class="border-hairline mt-6 flex min-h-72 flex-col items-center justify-center rounded-md border px-6 py-12 text-center"
    >
      <TriangleAlert :size="24" class="text-muted" aria-hidden="true" />
      <h2 class="text-ink-strong mt-5 mb-0 text-base font-semibold">Falha ao carregar promoções</h2>
      <p class="text-body mt-2 mb-0 text-sm">{{ promotionStore.errorMessage }}</p>
      <button
        type="button"
        class="bg-brand text-canvas hover:bg-brand-soft mt-6 min-h-11 cursor-pointer rounded-sm border-0 px-4 text-sm font-semibold transition-colors"
        @click="promotionStore.loadPromotions"
      >
        Tentar novamente
      </button>
    </div>

    <div
      v-else-if="promotionStore.promotions.length === 0"
      class="border-hairline mt-6 flex min-h-72 flex-col items-center justify-center rounded-md border px-6 py-12 text-center"
    >
      <SearchX :size="24" class="text-muted" aria-hidden="true" />
      <h2 class="text-ink-strong mt-5 mb-0 text-base font-semibold">Nenhuma promoção encontrada</h2>
      <p class="text-body mt-2 mb-0 max-w-md text-sm leading-6">
        Ajuste a busca ou os filtros para encontrar outros resultados.
      </p>
    </div>

    <div v-else class="mt-6 space-y-5">
      <PromotionTable :promotions="promotionStore.promotions" />
      <PromotionPagination
        :page="promotionStore.page"
        :page-count="promotionStore.pageCount"
        :total="promotionStore.total"
        @change="promotionStore.changePage"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import { CircleDashed } from '@lucide/vue'

import type { RecentPromotion } from '@/types/dashboard'
import {
  formatCurrency,
  formatDateTime,
  PROMOTION_STATUS_LABELS,
  PROMOTION_STORE_LABELS,
} from '@/utils/promotion'

defineProps<{
  promotions: RecentPromotion[]
}>()
</script>

<template>
  <section class="border-hairline mt-12 border-t" aria-labelledby="recent-promotions">
    <div class="flex items-center justify-between gap-4 py-5">
      <h2 id="recent-promotions" class="m-0 text-base font-semibold">Promoções recentes</h2>
      <span class="text-muted font-mono text-xs">
        {{ promotions.length }} {{ promotions.length === 1 ? 'registro' : 'registros' }}
      </span>
    </div>

    <div
      v-if="promotions.length === 0"
      class="border-hairline flex min-h-64 flex-col items-center justify-center border-y px-6 py-12 text-center"
    >
      <span
        class="border-hairline text-muted grid size-12 place-items-center rounded-full border"
        aria-hidden="true"
      >
        <CircleDashed :size="22" />
      </span>
      <h3 class="text-ink-strong mt-5 mb-0 text-base font-semibold">
        Nenhuma promoção em acompanhamento
      </h3>
      <p class="text-body mt-2 mb-0 max-w-md text-sm leading-6">
        Os rascunhos criados pelo painel ou pelo Telegram aparecerão aqui.
      </p>
    </div>

    <ul v-else class="border-hairline m-0 list-none border-y p-0">
      <li
        v-for="promotion in promotions"
        :key="promotion.id"
        class="border-hairline grid gap-3 border-b px-4 py-5 last:border-b-0 md:grid-cols-[minmax(0,1fr)_auto] md:items-center md:px-5"
      >
        <div class="min-w-0">
          <div class="flex flex-wrap items-center gap-2">
            <span
              class="border-hairline text-body rounded-full border px-2.5 py-1 font-mono text-[11px]"
            >
              {{ PROMOTION_STORE_LABELS[promotion.store] }}
            </span>
            <span class="text-brand font-mono text-xs">
              {{ PROMOTION_STATUS_LABELS[promotion.status] }}
            </span>
          </div>
          <h3 class="text-ink-strong mt-3 mb-0 truncate text-sm font-semibold">
            {{ promotion.title }}
          </h3>
          <p class="text-muted mt-1.5 mb-0 text-xs">{{ formatDateTime(promotion.createdAt) }}</p>
        </div>
        <strong class="text-ink-strong font-mono text-sm">
          {{ formatCurrency(promotion.priceInCents) }}
        </strong>
      </li>
    </ul>
  </section>
</template>

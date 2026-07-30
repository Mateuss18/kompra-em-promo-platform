<script setup lang="ts">
import { ArrowUpRight } from '@lucide/vue'

import type { Promotion } from '@/types/promotion'
import {
  formatCurrency,
  formatDateTime,
  PROMOTION_STATUS_LABELS,
  PROMOTION_STORE_LABELS,
} from '@/utils/promotion'

defineProps<{
  promotions: Promotion[]
}>()
</script>

<template>
  <div class="border-hairline overflow-x-auto rounded-md border">
    <table class="w-full min-w-3xl border-collapse text-left">
      <thead class="bg-canvas-soft">
        <tr class="text-muted font-mono text-xs tracking-wide uppercase">
          <th class="px-5 py-4 font-medium">Promoção</th>
          <th class="px-5 py-4 font-medium">Loja</th>
          <th class="px-5 py-4 font-medium">Status</th>
          <th class="px-5 py-4 font-medium">Preço</th>
          <th class="px-5 py-4 font-medium">Atualizada</th>
          <th class="w-12 px-5 py-4"><span class="sr-only">Ações</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="promotion in promotions" :key="promotion.id" class="border-hairline border-t">
          <td class="max-w-sm px-5 py-4">
            <strong class="text-ink-strong block truncate text-sm font-semibold">
              {{ promotion.title }}
            </strong>
            <span class="text-muted mt-1 block font-mono text-xs">{{ promotion.id }}</span>
          </td>
          <td class="text-body px-5 py-4 text-sm">
            {{ PROMOTION_STORE_LABELS[promotion.store] }}
          </td>
          <td class="px-5 py-4">
            <span
              class="border-hairline text-brand inline-flex rounded-full border px-2.5 py-1 font-mono text-xs"
            >
              {{ PROMOTION_STATUS_LABELS[promotion.status] }}
            </span>
          </td>
          <td class="text-ink-strong px-5 py-4 font-mono text-sm">
            {{ formatCurrency(promotion.priceInCents) }}
          </td>
          <td class="text-muted px-5 py-4 text-xs">
            {{ formatDateTime(promotion.updatedAt) }}
          </td>
          <td class="px-5 py-4">
            <RouterLink
              :to="{ name: 'promotion-details', params: { id: promotion.id } }"
              class="border-hairline text-body hover:border-brand hover:text-ink grid size-10 place-items-center rounded-sm border no-underline transition-colors"
              :aria-label="`Ver detalhes de ${promotion.title}`"
            >
              <ArrowUpRight :size="17" aria-hidden="true" />
            </RouterLink>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

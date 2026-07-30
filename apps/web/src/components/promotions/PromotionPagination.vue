<script setup lang="ts">
import { ChevronLeft, ChevronRight } from '@lucide/vue'

const props = defineProps<{
  page: number
  pageCount: number
  total: number
}>()
const emit = defineEmits<{
  change: [page: number]
}>()
</script>

<template>
  <footer class="flex flex-wrap items-center justify-between gap-4">
    <p class="text-muted m-0 font-mono text-xs">
      {{ total }} {{ total === 1 ? 'promoção' : 'promoções' }}
    </p>
    <div class="flex items-center gap-3">
      <button
        type="button"
        class="border-hairline text-body hover:border-brand hover:text-ink grid size-11 cursor-pointer place-items-center rounded-sm border bg-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page === 1"
        aria-label="Página anterior"
        @click="emit('change', props.page - 1)"
      >
        <ChevronLeft :size="18" aria-hidden="true" />
      </button>
      <span class="text-body font-mono text-xs">Página {{ page }} de {{ pageCount }}</span>
      <button
        type="button"
        class="border-hairline text-body hover:border-brand hover:text-ink grid size-11 cursor-pointer place-items-center rounded-sm border bg-transparent transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        :disabled="page === pageCount"
        aria-label="Próxima página"
        @click="emit('change', props.page + 1)"
      >
        <ChevronRight :size="18" aria-hidden="true" />
      </button>
    </div>
  </footer>
</template>

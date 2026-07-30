<script setup lang="ts">
import { Search } from '@lucide/vue'

import type { PromotionSort, PromotionStatus, PromotionStore } from '@/types/promotion'

const search = defineModel<string>('search', { required: true })
const sort = defineModel<PromotionSort>('sort', { required: true })
const status = defineModel<PromotionStatus | 'ALL'>('status', { required: true })
const store = defineModel<PromotionStore | 'ALL'>('store', { required: true })
const emit = defineEmits<{
  submit: []
}>()
</script>

<template>
  <form
    class="border-hairline grid gap-4 rounded-md border p-4 lg:grid-cols-[minmax(240px,1fr)_repeat(3,minmax(150px,auto))_auto]"
    @submit.prevent="emit('submit')"
  >
    <label class="relative">
      <span class="sr-only">Buscar por título</span>
      <Search
        :size="17"
        class="text-muted pointer-events-none absolute top-1/2 left-3 -translate-y-1/2"
        aria-hidden="true"
      />
      <input
        v-model="search"
        type="search"
        class="border-hairline bg-canvas-soft text-ink placeholder:text-muted focus:border-brand focus:ring-brand min-h-11 w-full rounded-sm border pr-4 pl-10 text-sm outline-none focus:ring-1"
        placeholder="Buscar por título"
      />
    </label>

    <label>
      <span class="sr-only">Filtrar por loja</span>
      <select
        v-model="store"
        class="border-hairline bg-canvas-soft text-ink focus:border-brand focus:ring-brand min-h-11 w-full rounded-sm border px-3 text-sm outline-none focus:ring-1"
      >
        <option value="ALL">Todas as lojas</option>
        <option value="AMAZON">Amazon</option>
        <option value="MERCADO_LIVRE">Mercado Livre</option>
        <option value="SHOPEE">Shopee</option>
      </select>
    </label>

    <label>
      <span class="sr-only">Filtrar por status</span>
      <select
        v-model="status"
        class="border-hairline bg-canvas-soft text-ink focus:border-brand focus:ring-brand min-h-11 w-full rounded-sm border px-3 text-sm outline-none focus:ring-1"
      >
        <option value="ALL">Todos os status</option>
        <option value="DRAFT">Rascunho</option>
        <option value="PROCESSING">Processando</option>
        <option value="READY_FOR_REVIEW">Pronta para revisão</option>
        <option value="APPROVED">Aprovada</option>
        <option value="REJECTED">Rejeitada</option>
        <option value="PUBLISHING">Publicando</option>
        <option value="PUBLISHED">Publicada</option>
        <option value="FAILED">Falha</option>
      </select>
    </label>

    <label>
      <span class="sr-only">Ordenar promoções</span>
      <select
        v-model="sort"
        class="border-hairline bg-canvas-soft text-ink focus:border-brand focus:ring-brand min-h-11 w-full rounded-sm border px-3 text-sm outline-none focus:ring-1"
      >
        <option value="NEWEST">Mais recentes</option>
        <option value="OLDEST">Mais antigas</option>
        <option value="PRICE_ASC">Menor preço</option>
        <option value="PRICE_DESC">Maior preço</option>
      </select>
    </label>

    <button
      type="submit"
      class="bg-brand text-canvas hover:bg-brand-soft min-h-11 cursor-pointer rounded-sm border-0 px-5 text-sm font-semibold transition-colors"
    >
      Aplicar
    </button>
  </form>
</template>

<script setup lang="ts">
import { Copy, Image } from '@lucide/vue'
import { computed, shallowRef } from 'vue'

import type { PromotionStore } from '@/types/promotion'
import { formatCurrency, PROMOTION_STORE_LABELS } from '@/utils/promotion'

const props = defineProps<{
  couponCode: string
  message: string
  originalPrice: number | string
  price: number | string
  store: PromotionStore
  title: string
}>()

const copied = shallowRef(false)

function formatPrice(value: number | string) {
  const price = Number(value)
  return Number.isFinite(price) && price > 0
    ? formatCurrency(Math.round(price * 100))
    : 'Preço indisponível'
}

const currentPrice = computed(() => formatPrice(props.price))
const originalPrice = computed(() => (props.originalPrice ? formatPrice(props.originalPrice) : ''))

async function copyMessage() {
  await navigator.clipboard.writeText(props.message.trim())
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 1500)
}
</script>

<template>
  <section class="border-hairline border-t p-6" aria-labelledby="preview-heading">
    <h2 id="preview-heading" class="m-0 text-lg font-semibold">Preview da promoção</h2>
    <p class="text-body mt-2 mb-0 text-sm">A arte e a mensagem acompanham as alterações.</p>

    <figure class="border-hairline bg-canvas-soft mt-6 overflow-hidden rounded-md border">
      <div class="grid aspect-square content-between gap-6 p-6">
        <div class="flex items-center justify-between gap-4">
          <span class="text-brand font-mono text-xs font-semibold tracking-wider uppercase">
            Kompra em Promo
          </span>
          <span class="border-hairline rounded-full border px-2.5 py-1 text-xs">
            {{ PROMOTION_STORE_LABELS[store] }}
          </span>
        </div>

        <div class="text-muted grid justify-items-center gap-3 text-center">
          <Image :size="44" :stroke-width="1.25" aria-hidden="true" />
          <span class="text-xs">Imagem do produto</span>
        </div>

        <div>
          <p class="text-ink-strong m-0 line-clamp-3 text-xl leading-tight font-semibold">
            {{ title.trim() || 'Título da promoção' }}
          </p>
          <p v-if="originalPrice" class="text-muted mt-4 mb-0 font-mono text-xs line-through">
            {{ originalPrice }}
          </p>
          <p class="text-brand mt-1 mb-0 font-mono text-3xl font-semibold">
            {{ currentPrice }}
          </p>
          <p
            v-if="couponCode.trim()"
            class="border-brand text-ink mt-4 mb-0 inline-block rounded-sm border border-dashed px-3 py-2 font-mono text-xs uppercase"
          >
            Cupom {{ couponCode.trim() }}
          </p>
        </div>
      </div>
      <figcaption class="sr-only">Preview da arte da promoção</figcaption>
    </figure>

    <div class="border-hairline mt-6 rounded-md border p-5">
      <div class="flex items-center justify-between gap-2">
        <h3 class="m-0 text-sm font-semibold">Mensagem</h3>
        <button
          type="button"
          class="text-brand hover:text-brand-soft inline-flex items-center gap-1.5 text-xs font-semibold transition-colors"
          @click="copyMessage"
        >
          <Copy :size="14" aria-hidden="true" />
          {{ copied ? 'Copiado' : 'Copiar' }}
        </button>
      </div>
      <p class="text-body mt-3 mb-0 whitespace-pre-wrap text-sm leading-6">
        {{ message.trim() || 'A mensagem da promoção aparecerá aqui.' }}
      </p>
    </div>
  </section>
</template>

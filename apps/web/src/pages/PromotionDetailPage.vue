<script setup lang="ts">
import { ArrowLeft, ExternalLink, TriangleAlert } from '@lucide/vue'
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { usePromotionStore } from '@/stores/promotionStore'
import {
  formatCurrency,
  formatDateTime,
  PROMOTION_STATUS_LABELS,
  PROMOTION_STORE_LABELS,
} from '@/utils/promotion'

const route = useRoute()
const promotionStore = usePromotionStore()

onMounted(() => {
  void promotionStore.loadPromotion(String(route.params.id))
})
</script>

<template>
  <div>
    <RouterLink
      :to="{ name: 'promotions' }"
      class="text-body hover:text-brand inline-flex min-h-11 items-center gap-2 text-sm no-underline transition-colors"
    >
      <ArrowLeft :size="17" aria-hidden="true" />
      Voltar para promoções
    </RouterLink>

    <div v-if="promotionStore.isLoading" role="status" class="mt-6" aria-live="polite">
      <span class="sr-only">Carregando promoção</span>
      <div class="border-hairline bg-canvas-soft h-96 animate-pulse rounded-md border" />
    </div>

    <div
      v-else-if="promotionStore.errorMessage"
      role="alert"
      class="border-hairline mt-6 flex min-h-72 flex-col items-center justify-center rounded-md border px-6 text-center"
    >
      <TriangleAlert :size="24" class="text-muted" aria-hidden="true" />
      <h1 class="text-ink-strong mt-5 mb-0 text-lg font-semibold">Falha ao carregar a promoção</h1>
      <p class="text-body mt-2 mb-0 text-sm">{{ promotionStore.errorMessage }}</p>
    </div>

    <div
      v-else-if="!promotionStore.selectedPromotion"
      class="border-hairline mt-6 flex min-h-72 flex-col items-center justify-center rounded-md border px-6 text-center"
    >
      <h1 class="text-ink-strong m-0 text-lg font-semibold">Promoção não encontrada</h1>
      <p class="text-body mt-2 mb-0 text-sm">O registro informado não está disponível.</p>
    </div>

    <template v-else>
      <header class="mt-6 max-w-4xl">
        <div class="flex flex-wrap items-center gap-2">
          <span class="border-hairline text-body rounded-full border px-2.5 py-1 font-mono text-xs">
            {{ PROMOTION_STORE_LABELS[promotionStore.selectedPromotion.store] }}
          </span>
          <span
            class="border-hairline text-brand rounded-full border px-2.5 py-1 font-mono text-xs"
          >
            {{ PROMOTION_STATUS_LABELS[promotionStore.selectedPromotion.status] }}
          </span>
        </div>
        <h1
          class="text-ink-strong mt-5 mb-0 text-3xl leading-tight font-normal tracking-[-0.04em] md:text-4xl"
        >
          {{ promotionStore.selectedPromotion.title }}
        </h1>
        <p class="text-muted mt-3 mb-0 font-mono text-xs">
          {{ promotionStore.selectedPromotion.id }}
        </p>
      </header>

      <section class="mt-10 grid gap-4 md:grid-cols-2" aria-label="Dados da promoção">
        <article class="border-hairline rounded-md border p-6">
          <h2 class="m-0 text-base font-semibold">Oferta</h2>
          <dl class="mt-6 grid gap-5">
            <div>
              <dt class="text-muted text-xs">Preço atual</dt>
              <dd class="text-ink-strong mt-1 mb-0 font-mono text-2xl">
                {{ formatCurrency(promotionStore.selectedPromotion.priceInCents) }}
              </dd>
            </div>
            <div v-if="promotionStore.selectedPromotion.originalPriceInCents !== null">
              <dt class="text-muted text-xs">Preço original</dt>
              <dd class="text-body mt-1 mb-0 font-mono text-sm">
                {{ formatCurrency(promotionStore.selectedPromotion.originalPriceInCents) }}
              </dd>
            </div>
            <div>
              <dt class="text-muted text-xs">Cupom</dt>
              <dd class="text-body mt-1 mb-0 font-mono text-sm">
                {{ promotionStore.selectedPromotion.couponCode ?? 'Sem cupom' }}
              </dd>
            </div>
          </dl>
        </article>

        <article class="border-hairline rounded-md border p-6">
          <h2 class="m-0 text-base font-semibold">Registro</h2>
          <dl class="mt-6 grid gap-5">
            <div>
              <dt class="text-muted text-xs">Criada em</dt>
              <dd class="text-body mt-1 mb-0 text-sm">
                {{ formatDateTime(promotionStore.selectedPromotion.createdAt) }}
              </dd>
            </div>
            <div>
              <dt class="text-muted text-xs">Atualizada em</dt>
              <dd class="text-body mt-1 mb-0 text-sm">
                {{ formatDateTime(promotionStore.selectedPromotion.updatedAt) }}
              </dd>
            </div>
          </dl>
        </article>

        <article class="border-hairline rounded-md border p-6 md:col-span-2">
          <h2 class="m-0 text-base font-semibold">Mensagem</h2>
          <p class="text-body mt-4 mb-0 whitespace-pre-wrap text-sm leading-6">
            {{ promotionStore.selectedPromotion.message }}
          </p>
        </article>

        <article class="border-hairline rounded-md border p-6 md:col-span-2">
          <h2 class="m-0 text-base font-semibold">Links</h2>
          <div class="mt-4 flex flex-wrap gap-3">
            <a
              :href="promotionStore.selectedPromotion.sourceUrl"
              target="_blank"
              rel="noreferrer"
              class="border-hairline text-body hover:border-brand hover:text-ink inline-flex min-h-11 items-center gap-2 rounded-sm border px-4 text-sm no-underline transition-colors"
            >
              Link original
              <ExternalLink :size="16" aria-hidden="true" />
            </a>
            <a
              :href="promotionStore.selectedPromotion.affiliateUrl"
              target="_blank"
              rel="noreferrer"
              class="bg-brand text-canvas hover:bg-brand-soft inline-flex min-h-11 items-center gap-2 rounded-sm px-4 text-sm font-semibold no-underline transition-colors"
            >
              Link de afiliado
              <ExternalLink :size="16" aria-hidden="true" />
            </a>
          </div>
        </article>
      </section>
    </template>
  </div>
</template>

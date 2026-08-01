<script setup lang="ts">
import { ArrowLeft, ExternalLink, TriangleAlert } from '@lucide/vue'
import { computed, onMounted, shallowRef } from 'vue'
import { useRoute } from 'vue-router'

import PromotionEditorForm from '@/components/promotions/PromotionEditorForm.vue'
import PromotionWorkflowActions from '@/components/promotions/PromotionWorkflowActions.vue'
import { usePromotionStore } from '@/stores/promotionStore'
import type { PromotionWorkflowAction, UpdatePromotionInput } from '@/types/promotion'
import { formatDateTime, PROMOTION_STATUS_LABELS, PROMOTION_STORE_LABELS } from '@/utils/promotion'

const route = useRoute()
const promotionStore = usePromotionStore()
const canEditPromotion = computed(
  () =>
    promotionStore.selectedPromotion?.status === 'DRAFT' ||
    promotionStore.selectedPromotion?.status === 'READY_FOR_REVIEW',
)
const hasUnsavedChanges = shallowRef(false)
const saveMessage = shallowRef('')

onMounted(() => {
  void promotionStore.loadPromotion(String(route.params.id))
})

async function savePromotion(input: UpdatePromotionInput) {
  saveMessage.value = ''

  if (await promotionStore.savePromotion(input)) {
    hasUnsavedChanges.value = false
    saveMessage.value = 'Alterações salvas.'
  }
}

function setDirty(isDirty: boolean) {
  hasUnsavedChanges.value = isDirty
  saveMessage.value = ''
}

async function transitionPromotion(action: PromotionWorkflowAction, rejectionReason?: string) {
  saveMessage.value = ''

  if (await promotionStore.transitionPromotion(action, rejectionReason)) {
    saveMessage.value = 'Status atualizado.'
  }
}
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
          Editar promoção
        </h1>
        <p class="text-muted mt-3 mb-0 font-mono text-xs">
          {{ promotionStore.selectedPromotion.id }}
        </p>
      </header>

      <p
        v-if="saveMessage"
        role="status"
        aria-live="polite"
        class="border-brand text-brand mt-6 mb-0 border-l-2 py-2 pl-4 text-sm"
      >
        {{ saveMessage }}
      </p>

      <div class="mt-10 grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(280px,1fr)]">
        <PromotionEditorForm
          :promotion="promotionStore.selectedPromotion"
          :is-read-only="!canEditPromotion"
          :is-saving="promotionStore.isSaving"
          :error-message="promotionStore.saveErrorMessage"
          @dirty="setDirty"
          @save="savePromotion"
        />

        <aside class="space-y-8" aria-label="Contexto da promoção">
          <PromotionWorkflowActions
            :disabled="hasUnsavedChanges"
            :error-message="promotionStore.transitionErrorMessage"
            :is-transitioning="promotionStore.isTransitioning"
            :promotion="promotionStore.selectedPromotion"
            @transition="transitionPromotion"
          />

          <section class="border-hairline border-t pt-6" aria-labelledby="record-heading">
            <h2 id="record-heading" class="m-0 text-base font-semibold">Registro</h2>
            <dl class="mt-5 grid gap-5">
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
          </section>

          <section class="border-hairline border-t pt-6" aria-labelledby="links-heading">
            <h2 id="links-heading" class="m-0 text-base font-semibold">Links</h2>
            <div class="mt-5 grid gap-3">
              <a
                :href="promotionStore.selectedPromotion.sourceUrl"
                target="_blank"
                rel="noreferrer"
                class="border-hairline text-body hover:border-brand hover:text-ink inline-flex min-h-11 items-center justify-between gap-2 rounded-sm border px-4 text-sm no-underline transition-colors"
              >
                Abrir link original
                <ExternalLink :size="16" aria-hidden="true" />
              </a>
              <a
                :href="promotionStore.selectedPromotion.affiliateUrl"
                target="_blank"
                rel="noreferrer"
                class="border-hairline text-body hover:border-brand hover:text-ink inline-flex min-h-11 items-center justify-between gap-2 rounded-sm border px-4 text-sm no-underline transition-colors"
              >
                Abrir link de afiliado
                <ExternalLink :size="16" aria-hidden="true" />
              </a>
            </div>
          </section>
        </aside>
      </div>
    </template>
  </div>
</template>

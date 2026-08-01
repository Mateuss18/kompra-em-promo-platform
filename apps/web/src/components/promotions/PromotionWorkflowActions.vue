<script setup lang="ts">
import { computed, shallowRef } from 'vue'

import type { Promotion, PromotionWorkflowAction } from '@/types/promotion'

const props = defineProps<{
  disabled: boolean
  errorMessage: string
  isTransitioning: boolean
  promotion: Promotion
}>()

const emit = defineEmits<{
  transition: [action: PromotionWorkflowAction, rejectionReason?: string]
}>()

const isRejecting = shallowRef(false)
const rejectionReason = shallowRef('')
const latestRejectionReason = computed(
  () =>
    [...(props.promotion.events ?? [])].reverse().find((event) => event.action === 'REJECT')
      ?.reason,
)

function rejectPromotion() {
  const reason = rejectionReason.value.trim()
  if (!reason || props.disabled) return

  emit('transition', 'REJECT', reason)
}
</script>

<template>
  <section class="border-hairline border-t pt-6" aria-labelledby="workflow-heading">
    <h2 id="workflow-heading" class="m-0 text-base font-semibold">Aprovação</h2>
    <p class="text-body mt-2 mb-0 text-sm leading-6">
      Revise o conteúdo antes de avançar a promoção.
    </p>

    <p v-if="disabled" class="text-muted mt-4 mb-0 text-xs leading-5">
      Salve ou descarte as alterações antes de mudar o status.
    </p>

    <div v-if="promotion.status === 'DRAFT'" class="mt-5">
      <button
        type="button"
        :disabled="disabled || isTransitioning"
        class="bg-brand text-canvas hover:bg-brand-soft min-h-11 w-full rounded-sm px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        @click="emit('transition', 'SUBMIT_FOR_REVIEW')"
      >
        {{ isTransitioning ? 'Atualizando...' : 'Enviar para revisão' }}
      </button>
    </div>

    <div v-else-if="promotion.status === 'READY_FOR_REVIEW'" class="mt-5 grid gap-3">
      <button
        type="button"
        :disabled="disabled || isTransitioning"
        class="bg-brand text-canvas hover:bg-brand-soft min-h-11 rounded-sm px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        @click="emit('transition', 'APPROVE')"
      >
        {{ isTransitioning ? 'Atualizando...' : 'Aprovar promoção' }}
      </button>
      <button
        type="button"
        :disabled="disabled || isTransitioning"
        class="border-hairline text-body hover:border-brand hover:text-ink min-h-11 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        @click="isRejecting = !isRejecting"
      >
        Rejeitar promoção
      </button>

      <form v-if="isRejecting" class="mt-2 grid gap-3" @submit.prevent="rejectPromotion">
        <label for="rejection-reason" class="text-sm font-medium">Motivo da rejeição</label>
        <textarea
          id="rejection-reason"
          v-model="rejectionReason"
          :disabled="disabled || isTransitioning"
          required
          rows="4"
          class="border-hairline bg-canvas-soft text-ink focus:border-brand resize-y rounded-sm border px-4 py-3 text-sm leading-6 outline-none transition-colors"
        />
        <button
          type="submit"
          :disabled="disabled || !rejectionReason.trim() || isTransitioning"
          class="border-hairline text-body hover:border-brand hover:text-ink min-h-11 rounded-sm border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          Confirmar rejeição
        </button>
      </form>
    </div>

    <div v-else-if="promotion.status === 'APPROVED'" class="mt-5">
      <button
        type="button"
        :disabled="disabled || isTransitioning"
        class="bg-brand text-canvas hover:bg-brand-soft min-h-11 w-full rounded-sm px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        @click="emit('transition', 'PUBLISH')"
      >
        {{ isTransitioning ? 'Publicando...' : 'Simular publicação' }}
      </button>
    </div>

    <p
      v-else-if="promotion.status === 'REJECTED' && latestRejectionReason"
      class="border-hairline text-body mt-5 rounded-sm border p-4 text-sm leading-6"
    >
      <span class="text-muted block text-xs">Motivo da rejeição</span>
      {{ latestRejectionReason }}
    </p>

    <p v-else class="text-muted mt-5 mb-0 text-sm leading-6">
      Não há ações disponíveis para este status.
    </p>

    <p v-if="errorMessage" role="alert" class="mt-4 mb-0 text-sm text-red-300">
      {{ errorMessage }}
    </p>
  </section>
</template>

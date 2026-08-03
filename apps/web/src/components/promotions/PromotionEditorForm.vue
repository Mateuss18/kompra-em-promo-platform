<script setup lang="ts">
import { computed, reactive, watch } from 'vue'

import PromotionPreview from '@/components/promotions/PromotionPreview.vue'
import type { Promotion, UpdatePromotionInput } from '@/types/promotion'
import { generatePromotionMessage } from '@/utils/promotion'

const props = defineProps<{
  errorMessage: string
  isReadOnly: boolean
  isSaving: boolean
  promotion: Promotion
}>()

const emit = defineEmits<{
  dirty: [isDirty: boolean]
  save: [input: UpdatePromotionInput]
}>()

function formatPriceInput(priceInCents: number | null) {
  return priceInCents === null ? '' : (priceInCents / 100).toFixed(2)
}

function getFormValues(promotion: Promotion) {
  return {
    couponCode: promotion.couponCode ?? '',
    message: promotion.message,
    originalPrice: formatPriceInput(promotion.originalPriceInCents),
    price: formatPriceInput(promotion.priceInCents),
    title: promotion.title,
  }
}

const initialValues = reactive(getFormValues(props.promotion))
const form = reactive({ ...initialValues })

watch(
  () => props.promotion,
  (promotion) => {
    Object.assign(initialValues, getFormValues(promotion))
    Object.assign(form, initialValues)
  },
)

const hasChanges = computed(
  () =>
    form.couponCode !== initialValues.couponCode ||
    form.message !== initialValues.message ||
    form.originalPrice !== initialValues.originalPrice ||
    form.price !== initialValues.price ||
    form.title !== initialValues.title,
)

const isValid = computed(() => {
  const price = Number(form.price)
  const originalPrice = form.originalPrice === '' ? null : Number(form.originalPrice)

  return (
    form.title.trim().length > 0 &&
    form.message.trim().length > 0 &&
    Number.isFinite(price) &&
    price > 0 &&
    (originalPrice === null || (Number.isFinite(originalPrice) && originalPrice > 0))
  )
})

const canSave = computed(
  () => hasChanges.value && isValid.value && !props.isReadOnly && !props.isSaving,
)

const canGenerateMessage = computed(() => {
  const price = Number(form.price)

  return form.title.trim().length > 0 && Number.isFinite(price) && price > 0 && !props.isReadOnly
})

watch(hasChanges, (isDirty) => emit('dirty', isDirty))

function resetForm() {
  if (!window.confirm('Descartar todas as alterações não salvas?')) return

  Object.assign(form, initialValues)
}

function generateMessage() {
  if (!canGenerateMessage.value) return

  const priceInCents = Math.round(Number(form.price) * 100)
  const originalPriceInCents =
    form.originalPrice === '' ? null : Math.round(Number(form.originalPrice) * 100)

  form.message = generatePromotionMessage(
    form.title,
    originalPriceInCents,
    priceInCents,
    props.promotion.store,
    props.promotion.affiliateUrl,
  )
}

function submitForm() {
  if (!canSave.value) return

  form.couponCode = form.couponCode.trim()
  form.message = form.message.trim()
  form.title = form.title.trim()

  emit('save', {
    couponCode: form.couponCode || null,
    message: form.message,
    originalPriceInCents:
      form.originalPrice === '' ? null : Math.round(Number(form.originalPrice) * 100),
    priceInCents: Math.round(Number(form.price) * 100),
    title: form.title,
  })
}
</script>

<template>
  <form class="border-hairline rounded-md border" @submit.prevent="submitForm">
    <section class="border-hairline border-b p-6" aria-labelledby="offer-heading">
      <h2 id="offer-heading" class="m-0 text-lg font-semibold">Oferta</h2>
      <p class="text-body mt-2 mb-0 text-sm">Preencha os dados do produto para gerar a mensagem.</p>
      <p v-if="isReadOnly" class="text-muted mt-2 mb-0 text-xs">
        A oferta fica bloqueada após a aprovação ou encerramento do fluxo.
      </p>

      <label class="grid gap-2 sm:col-span-2 mt-3" for="promotion-title">
        <span class="text-sm font-medium">Título</span>
        <input
          id="promotion-title"
          v-model="form.title"
          :disabled="isReadOnly"
          required
          autocomplete="off"
          class="border-hairline bg-canvas-soft text-ink focus:border-brand min-h-11 rounded-sm border px-4 text-sm outline-none transition-colors"
        />
      </label>

      <div class="mt-6 grid gap-5 sm:grid-cols-2">
        <label class="grid gap-2" for="promotion-original-price">
          <span class="text-sm font-medium">Preço De</span>
          <div class="relative">
            <span
              class="text-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-mono text-sm"
            >
              R$
            </span>
            <input
              id="promotion-original-price"
              v-model="form.originalPrice"
              :disabled="isReadOnly"
              type="number"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              class="border-hairline bg-canvas-soft text-ink focus:border-brand min-h-11 w-full rounded-sm border pr-4 pl-12 font-mono text-sm outline-none transition-colors"
            />
          </div>
        </label>

        <label class="grid gap-2" for="promotion-price">
          <span class="text-sm font-medium">Preço Por</span>
          <div class="relative">
            <span
              class="text-muted pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 font-mono text-sm"
            >
              R$
            </span>
            <input
              id="promotion-price"
              v-model="form.price"
              :disabled="isReadOnly"
              required
              type="number"
              min="0.01"
              step="0.01"
              inputmode="decimal"
              class="border-hairline bg-canvas-soft text-ink focus:border-brand min-h-11 w-full rounded-sm border pr-4 pl-12 font-mono text-sm outline-none transition-colors"
            />
          </div>
        </label>

        <label class="grid gap-2 sm:col-span-2" for="promotion-coupon">
          <span class="text-sm font-medium">Cupom</span>
          <input
            id="promotion-coupon"
            v-model="form.couponCode"
            :disabled="isReadOnly"
            autocomplete="off"
            placeholder="Sem cupom"
            class="border-hairline bg-canvas-soft text-ink focus:border-brand min-h-11 rounded-sm border px-4 font-mono text-sm uppercase outline-none transition-colors"
          />
        </label>
      </div>
    </section>

    <section class="p-6" aria-labelledby="message-heading">
      <div class="max-w-2xl">
        <h2 id="message-heading" class="m-0 text-lg font-semibold">Mensagem</h2>
        <p class="text-body mt-2 mb-0 text-sm">
          Gere a mensagem no formato do WhatsApp e ajuste o texto antes de salvar.
        </p>
      </div>

      <div class="mt-6 grid gap-5">
        <div class="grid gap-2">
          <div class="flex items-center justify-between gap-2">
            <label class="text-sm font-medium" for="promotion-message">Mensagem</label>
            <button
              type="button"
              :disabled="!canGenerateMessage"
              class="text-brand hover:text-brand-soft text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
              @click="generateMessage"
            >
              Gerar mensagem
            </button>
          </div>
          <textarea
            id="promotion-message"
            v-model="form.message"
            :disabled="isReadOnly"
            required
            rows="7"
            class="border-hairline bg-canvas-soft text-ink focus:border-brand min-h-40 resize-y rounded-sm border px-4 py-3 text-sm leading-6 outline-none transition-colors"
          />
        </div>
      </div>
    </section>

    <PromotionPreview
      :coupon-code="form.couponCode"
      :message="form.message"
      :original-price="form.originalPrice"
      :price="form.price"
      :store="promotion.store"
      :title="form.title"
    />

    <div
      class="border-hairline flex flex-col gap-4 border-t p-6 sm:flex-row sm:items-center sm:justify-between"
    >
      <p v-if="errorMessage" role="alert" class="m-0 text-sm text-red-300">
        {{ errorMessage }}
      </p>
      <span v-else />

      <div class="flex flex-col-reverse gap-3 sm:flex-row">
        <button
          type="button"
          :disabled="!hasChanges || isReadOnly || isSaving"
          class="border-hairline text-body hover:border-brand hover:text-ink min-h-11 rounded-sm border px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
          @click="resetForm"
        >
          Descartar alterações
        </button>
        <button
          type="submit"
          :disabled="!canSave"
          class="bg-brand text-canvas hover:bg-brand-soft min-h-11 rounded-sm px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ isSaving ? 'Salvando...' : 'Salvar alterações' }}
        </button>
      </div>
    </div>
  </form>
</template>

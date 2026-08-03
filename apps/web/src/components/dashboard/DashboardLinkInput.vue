<script setup lang="ts">
import { computed, shallowRef } from 'vue'

const props = defineProps<{
  errorMessage: string
  isCreating: boolean
}>()

const emit = defineEmits<{
  submit: [url: string]
}>()

const url = shallowRef('')

const isValid = computed(() => url.value.trim().length > 0 && !props.isCreating)

function submit() {
  const trimmedUrl = url.value.trim()
  if (!trimmedUrl || props.isCreating) return

  emit('submit', trimmedUrl)
}
</script>

<template>
  <section class="border-hairline mt-10 rounded-md border" aria-labelledby="link-input-heading">
    <div class="border-hairline border-b p-6">
      <h2 id="link-input-heading" class="m-0 text-lg font-semibold">Adicionar link</h2>
      <p class="text-body mt-2 mb-0 text-sm">Cole o link do produto para criar um rascunho.</p>
    </div>

    <form class="p-6" @submit.prevent="submit">
      <div class="grid gap-4 sm:flex">
        <input
          id="promotion-link"
          v-model="url"
          :disabled="isCreating"
          type="url"
          required
          placeholder="https://shopee.com.br/..."
          class="border-hairline bg-canvas-soft text-ink focus:border-brand min-h-11 flex-1 rounded-sm border px-4 text-sm outline-none transition-colors"
        />
        <button
          type="submit"
          :disabled="!isValid"
          class="bg-brand text-canvas hover:bg-brand-soft min-h-11 rounded-sm px-5 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
        >
          {{ isCreating ? 'Criando...' : 'Criar rascunho' }}
        </button>
      </div>

      <p v-if="errorMessage" role="alert" class="mt-3 mb-0 text-sm text-red-300">
        {{ errorMessage }}
      </p>
    </form>
  </section>
</template>

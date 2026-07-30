<script setup lang="ts">
import { LogIn, Zap } from '@lucide/vue'
import { shallowRef } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()
const email = shallowRef('')
const password = shallowRef('')
const errorMessage = shallowRef('')

async function handleSubmit() {
  if (!authStore.login(email.value, password.value)) {
    errorMessage.value = 'E-mail ou senha inválidos.'
    return
  }

  await router.push({ name: 'dashboard' })
}
</script>

<template>
  <main class="bg-canvas text-ink grid min-h-svh place-items-center px-5 py-10">
    <section class="w-full max-w-md" aria-labelledby="login-title">
      <header class="mb-8 text-center">
        <span class="bg-brand text-canvas mx-auto grid size-12 place-items-center rounded-sm">
          <Zap :size="24" :stroke-width="2.4" aria-hidden="true" />
        </span>
        <p class="text-brand mt-6 mb-0 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
          Central de afiliados
        </p>
        <h1
          id="login-title"
          class="text-ink-strong mt-3 mb-0 text-3xl leading-tight font-normal tracking-[-0.04em]"
        >
          Acesse o painel
        </h1>
        <p class="text-body mt-3 mb-0 text-sm leading-6">
          Entre com as credenciais de demonstração para continuar.
        </p>
      </header>

      <form
        class="border-hairline bg-canvas-soft rounded-md border p-6"
        @submit.prevent="handleSubmit"
      >
        <div>
          <label for="email" class="text-ink-strong text-sm font-semibold">E-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            autocomplete="username"
            required
            class="border-hairline bg-canvas text-ink placeholder:text-muted focus:border-brand focus:ring-brand mt-2 min-h-11 w-full rounded-sm border px-4 text-sm outline-none focus:ring-1"
            placeholder="admin@kompraempromo.com.br"
          />
        </div>

        <div class="mt-5">
          <label for="password" class="text-ink-strong text-sm font-semibold">Senha</label>
          <input
            id="password"
            v-model="password"
            type="password"
            autocomplete="current-password"
            required
            class="border-hairline bg-canvas text-ink placeholder:text-muted focus:border-brand focus:ring-brand mt-2 min-h-11 w-full rounded-sm border px-4 text-sm outline-none focus:ring-1"
            placeholder="Digite a senha"
          />
        </div>

        <p v-if="errorMessage" role="alert" class="mt-4 mb-0 text-sm text-red-400">
          {{ errorMessage }}
        </p>

        <button
          type="submit"
          class="bg-brand text-canvas hover:bg-brand-soft mt-6 flex min-h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-sm border-0 px-4 text-base font-semibold transition-colors"
        >
          <LogIn :size="18" aria-hidden="true" />
          Entrar
        </button>
      </form>

      <p class="text-muted mt-5 mb-0 text-center font-mono text-xs">
        Ambiente local · sessão simulada
      </p>
    </section>
  </main>
</template>

<script setup lang="ts">
import { CircleUserRound, LayoutDashboard, LogOut, Zap } from '@lucide/vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

async function logout() {
  authStore.logout()
  await router.push({ name: 'login' })
}
</script>

<template>
  <div class="min-h-svh bg-canvas text-ink lg:grid lg:grid-cols-[248px_1fr]">
    <aside
      class="border-hairline bg-canvas flex items-center justify-between border-b px-5 py-4 lg:sticky lg:top-0 lg:h-svh lg:flex-col lg:items-stretch lg:border-r lg:border-b-0 lg:px-4 lg:py-6"
    >
      <RouterLink
        to="/dashboard"
        class="text-ink-strong flex items-center gap-3 no-underline"
        aria-label="Kompra Em Promo"
      >
        <span class="bg-brand text-canvas grid size-9 place-items-center rounded-sm">
          <Zap :size="19" :stroke-width="2.4" aria-hidden="true" />
        </span>
        <span class="text-sm font-semibold tracking-[-0.01em]">Kompra Em Promo</span>
      </RouterLink>

      <nav class="lg:mt-10 lg:flex-1" aria-label="Navegação principal">
        <RouterLink
          to="/dashboard"
          class="bg-canvas-soft text-ink-strong hover:border-brand flex min-h-11 items-center gap-3 rounded-sm border border-transparent px-3 text-sm font-medium no-underline transition-colors"
        >
          <LayoutDashboard :size="18" aria-hidden="true" />
          <span class="hidden sm:inline">Visão geral</span>
        </RouterLink>
      </nav>

      <div class="border-hairline hidden items-center gap-3 border-t pt-5 lg:flex">
        <span class="border-hairline grid size-9 place-items-center rounded-full border">
          <CircleUserRound :size="18" aria-hidden="true" />
        </span>
        <span>
          <strong class="block text-sm font-medium">Administrador</strong>
          <small class="text-muted text-xs">Sessão simulada</small>
        </span>
      </div>
    </aside>

    <section class="min-w-0">
      <header
        class="border-hairline flex min-h-17 items-center justify-between border-b px-5 md:px-8 lg:px-10"
      >
        <div>
          <p class="text-muted m-0 text-xs">Central de afiliados</p>
          <strong class="mt-0.5 block text-sm font-medium">Painel operacional</strong>
        </div>
        <div class="flex items-center gap-3">
          <span
            class="border-hairline text-body rounded-full border px-3 py-1 font-mono text-[11px] tracking-wide uppercase"
          >
            MVP
          </span>
          <button
            type="button"
            class="border-hairline text-body hover:border-brand hover:text-ink flex min-h-11 cursor-pointer items-center gap-2 rounded-sm border bg-transparent px-3 text-sm transition-colors"
            aria-label="Sair da sessão"
            @click="logout"
          >
            <LogOut :size="17" aria-hidden="true" />
            <span class="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main class="px-5 py-8 md:px-8 lg:px-10 lg:py-12">
        <RouterView />
      </main>
    </section>
  </div>
</template>

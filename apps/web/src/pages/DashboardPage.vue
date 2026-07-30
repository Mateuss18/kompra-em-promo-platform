<script setup lang="ts">
import { CircleDashed } from '@lucide/vue'
</script>

<template>
  <div class="animate-[dashboard-in_320ms_ease-out]">
    <header class="max-w-2xl">
      <p class="text-brand m-0 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
        Dashboard
      </p>
      <h1
        class="text-ink-strong mt-3 mb-0 text-3xl leading-tight font-normal tracking-[-0.04em] md:text-4xl"
      >
        Visão geral
      </h1>
      <p class="text-body mt-3 mb-0 text-base leading-7">
        Acompanhe os rascunhos, aprovações e publicações em um só lugar.
      </p>
    </header>

    <section class="border-hairline mt-12 border-t" aria-labelledby="recent-promotions">
      <div class="flex items-center justify-between gap-4 py-5">
        <h2 id="recent-promotions" class="m-0 text-base font-semibold">Promoções recentes</h2>
        <span class="text-muted font-mono text-xs">0 registros</span>
      </div>

      <div
        class="border-hairline flex min-h-64 flex-col items-center justify-center border-y px-6 py-12 text-center"
      >
        <span
          class="border-hairline text-muted grid size-12 place-items-center rounded-full border"
          aria-hidden="true"
        >
          <CircleDashed :size="22" />
        </span>
        <h3 class="text-ink-strong mt-5 mb-0 text-base font-semibold">
          Nenhuma promoção em acompanhamento
        </h3>
        <p class="text-body mt-2 mb-0 max-w-md text-sm leading-6">
          Os rascunhos criados pelo painel ou pelo Telegram aparecerão aqui.
        </p>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes dashboard-in {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>

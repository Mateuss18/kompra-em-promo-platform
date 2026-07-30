<script setup lang="ts">
import PromotionsPanel from '@/components/promotions/PromotionsPanel.vue'
</script>

<template>
  <div>
    <header class="max-w-2xl">
      <p class="text-brand m-0 font-mono text-xs font-semibold tracking-[0.18em] uppercase">
        Promoções
      </p>
      <h1
        class="text-ink-strong mt-3 mb-0 text-3xl leading-tight font-normal tracking-[-0.04em] md:text-4xl"
      >
        Gestão de promoções
      </h1>
      <p class="text-body mt-3 mb-0 text-base leading-7">
        Encontre e acompanhe as ofertas recebidas das lojas parceiras.
      </p>
    </header>

    <PromotionsPanel />
  </div>
</template>

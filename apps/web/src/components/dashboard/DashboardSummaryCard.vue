<script setup lang="ts">
import type { Component } from 'vue'

defineProps<{
  icon: Component
  label: string
  value: number
}>()
</script>

<template>
  <article class="border-hairline rounded-md border p-6">
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-body m-0 text-sm">{{ label }}</p>
        <strong class="text-ink-strong mt-3 block font-mono text-3xl font-semibold">
          {{ value }}
        </strong>
      </div>
      <span
        class="border-hairline text-brand grid size-10 place-items-center rounded-full border"
        aria-hidden="true"
      >
        <component :is="icon" :size="19" />
      </span>
    </div>
  </article>
</template>

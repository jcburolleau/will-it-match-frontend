<script setup lang="ts">
defineProps<{
  num: string
  eyebrow: string
  title: string
  lede?: string
}>()
</script>

<template>
  <header class="mb-9">
    <div class="mb-3.5 flex items-baseline gap-4">
      <span class="font-mono text-[11px] tracking-[0.14em]" style="color: var(--accent)">{{ num }}</span>
      <span class="h-px flex-1" style="background: var(--hair)" />
      <span class="font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ eyebrow }}</span>
    </div>
    <h2
      class="m-0 max-w-[760px] font-display text-[52px] font-normal leading-[1.02] tracking-tight"
      style="text-wrap: balance; color: var(--ink)"
      v-html="title"
    />
    <p
      v-if="lede"
      class="mt-4 max-w-[620px] font-body text-base leading-relaxed"
      style="color: rgba(30,26,22,0.78)"
    >
      {{ lede }}
    </p>
  </header>
</template>

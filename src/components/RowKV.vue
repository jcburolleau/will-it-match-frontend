<script setup lang="ts">
defineProps<{
  k: string
  v: string
}>()
</script>

<template>
  <div class="flex items-baseline gap-1.5 font-mono text-xs">
    <span class="uppercase tracking-widest" style="color: var(--muted)">{{ k }}</span>
    <span class="flex-1 -translate-y-0.5 border-b border-dotted" style="border-color: rgba(30,26,22,0.25)" />
    <span style="color: rgba(30,26,22,0.85)">{{ v }}</span>
  </div>
</template>

<script setup lang="ts">
import type { MatchResult } from '../prompts/match'

defineProps<{
  result: MatchResult
}>()
</script>

<template>
  <section class="mb-6 space-y-4">
    <div class="rounded-2xl p-6" style="border: 1px solid var(--hair); background: rgba(255,250,238,0.55)">
      <div class="font-display text-4xl">{{ result.overall_score }} <span class="font-mono text-sm" style="color: var(--muted)">/ 100</span></div>
      <p class="mt-2 text-base leading-relaxed" style="color: rgba(30,26,22,0.85)">{{ result.verdict }}</p>
    </div>
  </section>
</template>

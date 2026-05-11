<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  displayScore: number
  ringStroke: string
  ringTrack: string
  numberText: string
}>()

const ringCircumference = 2 * Math.PI * 42
const ringOffset = computed(() => {
  const score = Math.max(0, Math.min(100, props.displayScore))
  return ringCircumference * (1 - score / 100)
})
</script>

<template>
  <div class="relative h-32 w-32 shrink-0">
    <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke-width="10"
        :class="ringTrack"
      />
      <circle
        cx="50"
        cy="50"
        r="42"
        fill="none"
        stroke-width="10"
        stroke-linecap="round"
        :class="ringStroke"
        :stroke-dasharray="ringCircumference"
        :stroke-dashoffset="ringOffset"
      />
    </svg>
    <div class="absolute inset-0 flex flex-col items-center justify-center">
      <span class="text-3xl font-bold tabular-nums" :class="numberText">
        {{ Math.round(displayScore) }}
      </span>
      <span class="text-xs font-medium text-slate-500">/ 100</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Accent = 'emerald' | 'amber' | 'indigo'

const props = defineProps<{
  title: string
  items: string[]
  accent: Accent
}>()

const ACCENT_CLASSES: Record<Accent, {
  border: string
  bg: string
  iconText: string
  titleText: string
  badgeBg: string
  badgeText: string
  dot: string
}> = {
  emerald: {
    border: 'border-emerald-200',
    bg: 'bg-emerald-50/60',
    iconText: 'text-emerald-600',
    titleText: 'text-emerald-900',
    badgeBg: 'bg-emerald-100',
    badgeText: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  amber: {
    border: 'border-amber-200',
    bg: 'bg-amber-50/60',
    iconText: 'text-amber-600',
    titleText: 'text-amber-900',
    badgeBg: 'bg-amber-100',
    badgeText: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  indigo: {
    border: 'border-indigo-200',
    bg: 'bg-indigo-50/60',
    iconText: 'text-indigo-600',
    titleText: 'text-indigo-900',
    badgeBg: 'bg-indigo-100',
    badgeText: 'text-indigo-800',
    dot: 'bg-indigo-500',
  },
}

const c = computed(() => ACCENT_CLASSES[props.accent])
</script>

<template>
  <div class="result-card rounded-2xl border p-5" :class="[c.border, c.bg]">
    <div class="mb-3 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <span :class="['h-5 w-5', c.iconText]">
          <slot name="icon" />
        </span>
        <h3 class="text-sm font-semibold" :class="c.titleText">{{ title }}</h3>
      </div>
      <span
        class="rounded-full px-2 py-0.5 text-xs font-semibold"
        :class="[c.badgeBg, c.badgeText]"
      >
        {{ items.length }}
      </span>
    </div>
    <ul class="space-y-2">
      <li
        v-for="(item, i) in items"
        :key="i"
        class="flex gap-2 text-sm leading-snug text-slate-800"
      >
        <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" :class="c.dot" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

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
    border: 'border-emerald-500/20',
    bg: 'bg-emerald-500/[0.08]',
    iconText: 'text-emerald-400',
    titleText: 'text-emerald-300',
    badgeBg: 'bg-emerald-500/20',
    badgeText: 'text-emerald-300',
    dot: 'bg-emerald-400',
  },
  amber: {
    border: 'border-orange-500/20',
    bg: 'bg-orange-500/[0.08]',
    iconText: 'text-orange-400',
    titleText: 'text-orange-300',
    badgeBg: 'bg-orange-500/20',
    badgeText: 'text-orange-300',
    dot: 'bg-orange-400',
  },
  indigo: {
    border: 'border-cyan-500/20',
    bg: 'bg-cyan-500/[0.08]',
    iconText: 'text-cyan-400',
    titleText: 'text-cyan-300',
    badgeBg: 'bg-cyan-500/20',
    badgeText: 'text-cyan-300',
    dot: 'bg-cyan-400',
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
        class="flex gap-2 text-sm leading-snug text-slate-300"
      >
        <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full" :class="c.dot" />
        <span>{{ item }}</span>
      </li>
    </ul>
  </div>
</template>

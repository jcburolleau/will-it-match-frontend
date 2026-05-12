<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

defineProps<{
  step: number
  modelName: string
}>()

defineEmits<{
  'open-settings': []
}>()

const { locale } = useI18n()

const currentLocale = computed({
  get: () => (locale.value === 'en' ? 'en' : 'es') as 'en' | 'es',
  set: (value: 'es' | 'en') => {
    locale.value = value
    localStorage.setItem('locale', value)
  },
})

const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()
</script>

<template>
  <header
    class="grid items-center px-10 py-5"
    style="grid-template-columns: 1fr auto 1fr; border-bottom: 1px solid var(--hair)"
  >
    <div class="flex items-baseline gap-3">
      <span class="inline-block h-2 w-2 rounded-sm" style="background: var(--accent)" />
      <span class="font-display text-[22px] tracking-tight" style="color: var(--ink)">Will&nbsp;it&nbsp;Match</span>
    </div>
    <div class="justify-self-center font-mono text-[10px] uppercase tracking-[0.18em]" style="color: var(--muted)">
      Ledger · step {{ String(step).padStart(2, '0') }} of 04
    </div>
    <div class="flex items-center gap-3.5 justify-self-end font-mono text-[10px] uppercase tracking-[0.14em]" style="color: var(--muted)">
      <span>{{ today }}</span>
      <span v-if="modelName" style="color: var(--accent)">● local · {{ modelName }}</span>
      <select
        v-model="currentLocale"
        class="cursor-pointer rounded px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]"
        style="background: transparent; border: 1px solid var(--hair); color: var(--muted)"
      >
        <option value="en" style="background: var(--paper)">EN</option>
        <option value="es" style="background: var(--paper)">ES</option>
      </select>
      <button
        class="cursor-pointer rounded px-2 py-0.5"
        style="background: transparent; border: 1px solid var(--hair); color: var(--muted)"
        @click="$emit('open-settings')"
      >
        ⚙
      </button>
    </div>
  </header>
</template>

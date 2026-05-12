<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

defineEmits<{
  'open-settings': []
}>()

const currentLocale = computed({
  get: () => (locale.value === 'en' ? 'en' : 'es') as 'en' | 'es',
  set: (value: 'es' | 'en') => {
    locale.value = value
    localStorage.setItem('locale', value)
  },
})
</script>

<template>
  <header class="mb-8 flex items-center justify-between gap-4">
    <div>
      <h1 class="bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
        {{ t('appTitle') }}
      </h1>
      <p class="mt-1 text-sm text-slate-500">{{ t('subtitle') }}</p>
    </div>
    <div class="flex items-center gap-2">
      <select
        v-model="currentLocale"
        class="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-sm text-slate-300 outline-none transition hover:border-white/20 focus:border-violet-500/50"
      >
        <option value="es" class="bg-slate-900">ES</option>
        <option value="en" class="bg-slate-900">EN</option>
      </select>
      <button
        class="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
        @click="$emit('open-settings')"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </header>
</template>

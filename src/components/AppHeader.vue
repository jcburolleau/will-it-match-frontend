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
  <header class="mb-6 flex items-center justify-between gap-4">
    <div>
      <h1 class="text-2xl font-semibold text-slate-900">{{ t('appTitle') }}</h1>
      <p class="text-sm text-slate-600">{{ t('subtitle') }}</p>
    </div>
    <div class="flex items-center gap-3 text-sm">
      <label class="flex items-center gap-2">
        <span>{{ t('language') }}</span>
        <select
          v-model="currentLocale"
          class="rounded border border-slate-400 px-2 py-1 text-slate-900"
        >
          <option value="es">ES</option>
          <option value="en">EN</option>
        </select>
      </label>
      <button
        class="rounded border border-slate-400 px-3 py-1 text-slate-700 hover:bg-slate-100"
        @click="$emit('open-settings')"
      >
        {{ t('settings') }}
      </button>
    </div>
  </header>
</template>

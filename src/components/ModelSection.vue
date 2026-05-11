<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { OllamaModel } from '../services/ollama'

type ConnectionState =
  | { state: 'checking' }
  | { state: 'ok' }
  | { state: 'error'; message: string }

defineProps<{
  connection: ConnectionState
  models: OllamaModel[]
}>()

const selectedModel = defineModel<string>('selectedModel', { default: '' })

defineEmits<{
  refresh: []
}>()

const { t } = useI18n()
</script>

<template>
  <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
    <h2 class="mb-3 text-lg font-semibold text-slate-900">{{ t('modelSection') }}</h2>
    <div v-if="connection.state === 'ok' && models.length === 0" class="text-sm text-slate-700">
      <p>{{ t('noModels') }}</p>
      <pre class="mt-2 rounded bg-slate-100 px-3 py-2 font-mono text-xs">{{ t('noModelsExample') }}</pre>
      <button
        class="mt-3 rounded border border-slate-400 px-3 py-1 hover:bg-slate-100"
        @click="$emit('refresh')"
      >
        {{ t('refreshModels') }}
      </button>
    </div>
    <div v-else-if="connection.state === 'ok'" class="flex items-center gap-3">
      <label class="flex flex-1 items-center gap-2">
        <span class="text-sm text-slate-700">{{ t('modelLabel') }}</span>
        <select
          v-model="selectedModel"
          class="flex-1 rounded border border-slate-400 px-3 py-2"
        >
          <option value="" disabled>{{ t('modelPlaceholder') }}</option>
          <option v-for="m in models" :key="m.name" :value="m.name">{{ m.name }}</option>
        </select>
      </label>
      <button
        class="rounded border border-slate-400 px-3 py-2 text-sm hover:bg-slate-100"
        @click="$emit('refresh')"
      >
        {{ t('refreshModels') }}
      </button>
    </div>
  </section>
</template>

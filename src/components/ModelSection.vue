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
  <section class="glass-card mb-6 rounded-2xl p-6">
    <h2 class="mb-3 text-lg font-semibold text-white">{{ t('modelSection') }}</h2>
    <div v-if="connection.state === 'ok' && models.length === 0" class="text-sm text-slate-400">
      <p>{{ t('noModels') }}</p>
      <pre class="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-xs text-slate-300">{{ t('noModelsExample') }}</pre>
      <button
        class="mt-3 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white"
        @click="$emit('refresh')"
      >
        {{ t('refreshModels') }}
      </button>
    </div>
    <div v-else-if="connection.state === 'ok'" class="flex items-center gap-3">
      <label class="flex flex-1 items-center gap-2">
        <span class="text-sm text-slate-400">{{ t('modelLabel') }}</span>
        <select
          v-model="selectedModel"
          class="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none transition hover:border-white/20 focus:border-violet-500/50"
        >
          <option value="" disabled class="bg-slate-900">{{ t('modelPlaceholder') }}</option>
          <option v-for="m in models" :key="m.name" :value="m.name" class="bg-slate-900">{{ m.name }}</option>
        </select>
      </label>
      <button
        class="rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        @click="$emit('refresh')"
      >
        {{ t('refreshModels') }}
      </button>
    </div>
  </section>
</template>

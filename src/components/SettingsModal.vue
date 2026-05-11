<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  open: boolean
  initialUrl: string
}>()

const emit = defineEmits<{
  close: []
  save: [url: string]
}>()

const { t } = useI18n()

const draftBaseUrl = ref(props.initialUrl)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) draftBaseUrl.value = props.initialUrl
  },
)

function save(): void {
  emit('save', draftBaseUrl.value.trim() || 'http://localhost:11434')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4"
    @click.self="$emit('close')"
  >
    <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
      <h3 class="mb-4 text-lg font-semibold text-slate-900">{{ t('settings') }}</h3>
      <label class="mb-4 block">
        <span class="mb-1 block text-sm text-slate-700">{{ t('ollamaUrlLabel') }}</span>
        <input
          v-model="draftBaseUrl"
          class="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          placeholder="http://localhost:11434"
        />
      </label>
      <div class="flex justify-end gap-2">
        <button
          class="rounded border border-slate-400 px-3 py-2 text-sm hover:bg-slate-100"
          @click="$emit('close')"
        >
          {{ t('close') }}
        </button>
        <button
          class="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
          @click="save"
        >
          {{ t('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

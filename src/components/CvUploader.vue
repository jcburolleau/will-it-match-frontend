<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { extractText } from '../services/parseCv'

const cvFile = defineModel<File | null>('cvFile', { default: null })
const cvText = defineModel<string>('cvText', { default: '' })

const { t } = useI18n()

const cvParsing = ref(false)
const cvError = ref('')
const isCvDragging = ref(false)

async function onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await loadCv(file)
  input.value = ''
}

async function onDrop(event: DragEvent): Promise<void> {
  event.preventDefault()
  isCvDragging.value = false
  const file = event.dataTransfer?.files?.[0]
  if (!file) return
  await loadCv(file)
}

async function loadCv(file: File): Promise<void> {
  cvFile.value = file
  cvText.value = ''
  cvError.value = ''
  cvParsing.value = true
  try {
    cvText.value = await extractText(file)
  } catch (err) {
    cvError.value = err instanceof Error ? err.message : String(err)
    cvFile.value = null
  } finally {
    cvParsing.value = false
  }
}
</script>

<template>
  <section class="glass-card mb-6 rounded-2xl p-6">
    <h2 class="mb-3 text-lg font-semibold text-white">{{ t('cvSection') }}</h2>
    <label
      class="flex min-h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed px-6 py-6 text-center transition-all"
      :class="isCvDragging
        ? 'border-violet-500/60 bg-violet-500/10'
        : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'"
      @dragover.prevent="isCvDragging = true"
      @dragleave.prevent="isCvDragging = false"
      @drop="onDrop"
    >
      <input
        class="hidden"
        type="file"
        accept=".pdf,.docx,.txt"
        @change="onFileSelected"
      />
      <span class="text-slate-400">
        <template v-if="cvParsing">
          <svg class="mx-auto mb-2 h-5 w-5 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
            <path d="M22 12a10 10 0 0 1-10 10" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
          </svg>
        </template>
        <template v-else-if="cvFile && cvText">
          <span class="text-emerald-400">&#10003;</span>
          {{ t('cvParsed', { chars: cvText.length, name: cvFile.name }) }}
        </template>
        <template v-else>
          <svg class="mx-auto mb-2 h-8 w-8 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          {{ t('cvDropzone') }}
        </template>
      </span>
    </label>
    <p v-if="cvError" class="mt-2 text-sm text-red-400">{{ cvError }}</p>
  </section>
</template>

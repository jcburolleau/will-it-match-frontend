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
  <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
    <h2 class="mb-3 text-lg font-semibold text-slate-900">{{ t('cvSection') }}</h2>
    <label
      class="flex min-h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed px-6 py-6 text-center transition"
      :class="isCvDragging ? 'border-blue-700 bg-blue-50' : 'border-slate-400 bg-slate-50'"
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
      <span class="text-slate-700">
        <template v-if="cvParsing">…</template>
        <template v-else-if="cvFile && cvText">
          {{ t('cvParsed', { chars: cvText.length, name: cvFile.name }) }}
        </template>
        <template v-else>{{ t('cvDropzone') }}</template>
      </span>
    </label>
    <p v-if="cvError" class="mt-2 text-sm text-red-600">{{ cvError }}</p>
  </section>
</template>

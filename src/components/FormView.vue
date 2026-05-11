<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import CvUploader from './CvUploader.vue'

defineProps<{
  analyzing: boolean
  generalError: string
}>()

const cvFile = defineModel<File | null>('cvFile', { default: null })
const cvText = defineModel<string>('cvText', { default: '' })
const jdText = defineModel<string>('jdText', { default: '' })

defineEmits<{
  analyze: []
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <CvUploader v-model:cv-file="cvFile" v-model:cv-text="cvText" />

    <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 class="mb-3 text-lg font-semibold text-slate-900">{{ t('jdSection') }}</h2>
      <textarea
        v-model="jdText"
        rows="10"
        class="w-full rounded-lg border border-slate-300 p-3 text-sm"
        :placeholder="t('jdPlaceholder')"
      />
    </section>

    <div class="mb-6 flex items-center justify-end gap-3">
      <p v-if="generalError" class="mr-auto text-sm text-red-600">{{ generalError }}</p>
      <button
        class="rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="analyzing"
        @click="$emit('analyze')"
      >
        {{ t('analyze') }}
      </button>
    </div>
  </div>
</template>

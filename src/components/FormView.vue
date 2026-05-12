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

    <section class="glass-card mb-6 rounded-2xl p-6">
      <h2 class="mb-3 text-lg font-semibold text-white">{{ t('jdSection') }}</h2>
      <textarea
        v-model="jdText"
        rows="10"
        class="w-full rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-200 placeholder-slate-600 outline-none transition focus:border-violet-500/50"
        :placeholder="t('jdPlaceholder')"
      />
    </section>

    <div class="mb-6 flex items-center justify-end gap-3">
      <p v-if="generalError" class="mr-auto text-sm text-red-400">{{ generalError }}</p>
      <button
        class="rounded-2xl bg-gradient-to-r from-violet-600 to-blue-500 px-7 py-3 text-lg font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:from-violet-500 hover:to-blue-400 hover:shadow-violet-500/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        :disabled="analyzing"
        @click="$emit('analyze')"
      >
        {{ t('analyze') }}
      </button>
    </div>
  </div>
</template>

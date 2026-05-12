<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { MatchResult } from '../prompts/match'
import LoadingCard from './LoadingCard.vue'
import ResultPanel from './ResultPanel.vue'
import ParseFailedCard from './ParseFailedCard.vue'

defineProps<{
  analyzing: boolean
  parsed: MatchResult | null
  parseFailed: boolean
}>()

defineEmits<{
  cancel: []
  reset: []
  retry: []
}>()

const { t } = useI18n()
</script>

<template>
  <div>
    <div class="mb-4 flex items-center justify-between">
      <button
        v-if="analyzing"
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        @click="$emit('cancel')"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM8.7 7.3a1 1 0 0 0-1.4 1.4L8.6 10l-1.3 1.3a1 1 0 1 0 1.4 1.4L10 11.4l1.3 1.3a1 1 0 0 0 1.4-1.4L11.4 10l1.3-1.3a1 1 0 0 0-1.4-1.4L10 8.6 8.7 7.3z"
            clip-rule="evenodd"
          />
        </svg>
        {{ t('cancel') }}
      </button>
      <button
        v-else
        class="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-slate-400 transition hover:bg-white/5 hover:text-white"
        @click="$emit('reset')"
      >
        <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M9.7 3.3a1 1 0 0 1 0 1.4L6.4 8H15a4 4 0 1 1 0 8h-2a1 1 0 1 1 0-2h2a2 2 0 1 0 0-4H6.4l3.3 3.3a1 1 0 1 1-1.4 1.4l-5-5a1 1 0 0 1 0-1.4l5-5a1 1 0 0 1 1.4 0z"
            clip-rule="evenodd"
          />
        </svg>
        {{ t('newAnalysis') }}
      </button>
      <span />
    </div>

    <LoadingCard v-if="analyzing" />
    <ResultPanel v-else-if="parsed" :result="parsed" />
    <ParseFailedCard v-else-if="parseFailed" @retry="$emit('retry')" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  url: string
  message: string
}>()

defineEmits<{
  retry: []
}>()

const { t } = useI18n()
</script>

<template>
  <section class="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800">
    <p class="font-semibold">
      {{ t('connectionError', { url }) }}
    </p>
    <p class="mt-1">{{ t('connectionHelp') }}</p>
    <p class="mt-2 font-mono text-xs text-red-700">{{ message }}</p>
    <button
      class="mt-3 rounded border border-red-400 bg-white px-3 py-1 text-red-700 hover:bg-red-100"
      @click="$emit('retry')"
    >
      {{ t('refreshModels') }}
    </button>
  </section>
</template>

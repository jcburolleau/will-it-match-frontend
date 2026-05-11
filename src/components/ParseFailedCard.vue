<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5">
    <p class="text-sm text-amber-900">{{ t('parseError') }}</p>
    <button
      class="mt-3 rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-100"
      @click="$emit('retry')"
    >
      {{ t('retry') }}
    </button>
  </section>
</template>

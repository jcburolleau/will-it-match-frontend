<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineEmits<{
  retry: []
}>()
</script>

<template>
  <section class="mb-6 rounded-2xl border border-orange-500/20 bg-orange-500/10 p-5">
    <p class="text-sm text-orange-300">{{ t('parseError') }}</p>
    <button
      class="mt-3 rounded-lg border border-orange-500/30 px-3 py-1.5 text-sm text-orange-300 transition hover:bg-orange-500/15"
      @click="$emit('retry')"
    >
      {{ t('retry') }}
    </button>
  </section>
</template>

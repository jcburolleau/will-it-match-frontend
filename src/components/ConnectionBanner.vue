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
  <section class="px-10 py-4 text-sm" style="border-bottom: 1px solid var(--hair); background: rgba(140,40,40,0.04)">
    <p class="font-display text-base italic" style="color: oklch(38% 0.105 28)">
      {{ t('connectionError', { url }) }}
    </p>
    <p class="mt-1 text-[13px]" style="color: rgba(30,26,22,0.7)">{{ t('connectionHelp') }}</p>
    <p class="mt-2 font-mono text-xs" style="color: var(--muted)">{{ message }}</p>
    <button
      class="mt-3 cursor-pointer font-mono text-[10px] uppercase tracking-[0.16em]"
      style="background: transparent; border: 1px solid var(--hair); padding: 8px 14px; color: var(--muted)"
      @click="$emit('retry')"
    >
      {{ t('refreshModels') }}
    </button>
  </section>
</template>

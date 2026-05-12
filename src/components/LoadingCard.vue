<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <section class="glass-card mb-6 rounded-2xl p-6">
    <div class="flex items-center gap-3">
      <svg class="h-6 w-6 animate-spin text-violet-400" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
        <path
          d="M22 12a10 10 0 0 1-10 10"
          stroke="currentColor"
          stroke-width="3"
          stroke-linecap="round"
        />
      </svg>
      <div>
        <p class="text-base font-medium text-white">{{ t('loadingTitle') }}</p>
        <p class="text-sm text-slate-500">{{ t('loadingHint') }}</p>
      </div>
    </div>
    <div class="mt-6 space-y-3">
      <div class="h-20 animate-pulse rounded-xl bg-white/[0.04]" />
      <div class="grid gap-3 md:grid-cols-3">
        <div class="h-32 animate-pulse rounded-xl bg-white/[0.04]" />
        <div class="h-32 animate-pulse rounded-xl bg-white/[0.04]" style="animation-delay: 150ms" />
        <div class="h-32 animate-pulse rounded-xl bg-white/[0.04]" style="animation-delay: 300ms" />
      </div>
    </div>
  </section>
</template>

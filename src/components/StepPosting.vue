<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import StepHead from './StepHead.vue'

const jdText = defineModel<string>('jdText', { default: '' })

defineEmits<{
  back: []
  next: []
}>()

const { t } = useI18n()

const words = computed(() => jdText.value.trim().split(/\s+/).filter(Boolean).length)
const chars = computed(() => jdText.value.length)
const ok = computed(() => jdText.value.trim().length >= 40)
</script>

<template>
  <div>
    <StepHead
      num="02 — POSTING"
      :eyebrow="t('stepPostingEyebrow')"
      :title="t('stepPostingTitle')"
      :lede="t('stepPostingLede')"
    />

    <div class="grid gap-9" style="grid-template-columns: 1fr 300px">
      <!-- Textarea card -->
      <div style="border: 1px solid var(--hair); background: rgba(255,250,238,0.55)" class="flex flex-col">
        <div
          class="flex items-center justify-between px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em]"
          style="border-bottom: 1px solid var(--hair); color: var(--muted)"
        >
          <span>{{ t('jdSection') }}</span>
          <button
            class="cursor-pointer font-mono text-[10px] uppercase tracking-[0.14em]"
            style="background: transparent; border: 1px solid var(--hair); padding: 5px 10px; color: var(--muted)"
            @click="jdText = ''"
          >
            {{ t('postingClear') }}
          </button>
        </div>
        <textarea
          v-model="jdText"
          :placeholder="t('jdPlaceholder')"
          class="flex-1 resize-y border-none bg-transparent px-7 py-5 font-body text-[15px] leading-relaxed outline-none"
          style="min-height: 440px; color: var(--ink)"
        />
        <div
          class="flex justify-between px-4 py-2.5 font-mono text-[10px] tracking-[0.12em]"
          style="border-top: 1px solid var(--hair); color: var(--muted)"
        >
          <span>{{ words.toLocaleString() }} {{ t('postingWords') }} · {{ chars.toLocaleString() }} {{ t('postingChars') }}</span>
        </div>
      </div>

      <!-- Sidebar info -->
      <div class="flex flex-col gap-5">
        <div>
          <div class="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('postingInfo') }}</div>
          <p class="text-[13px] leading-relaxed" style="color: rgba(30,26,22,0.78)">
            {{ t('postingInfoText') }}
          </p>
        </div>
      </div>
    </div>

    <!-- Nav -->
    <div
      class="mt-12 flex items-center justify-between"
      style="padding-top: 22px; border-top: 1px solid var(--hair)"
    >
      <div class="flex items-center gap-6">
        <button
          class="cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.16em]"
          style="color: var(--muted)"
          @click="$emit('back')"
        >
          ← {{ t('navBack') }}
        </button>
        <span class="font-mono text-[11px] tracking-[0.06em]" style="color: var(--muted)">
          {{ ok ? t('postingHintOk') : t('postingHintNeed') }}
        </span>
      </div>
      <button
        :disabled="!ok"
        class="cursor-pointer border-none px-7 py-3.5 font-display text-[17px] italic"
        :style="{
          background: !ok ? 'rgba(30,26,22,0.35)' : 'var(--ink)',
          color: 'var(--paper)',
          borderRadius: '2px',
          cursor: !ok ? 'not-allowed' : 'pointer',
        }"
        @click="$emit('next')"
      >
        {{ t('stepPostingNext') }} →
      </button>
    </div>
  </div>
</template>

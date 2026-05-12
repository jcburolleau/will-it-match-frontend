<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { extractText } from '../services/parseCv'
import StepHead from './StepHead.vue'

const cvFile = defineModel<File | null>('cvFile', { default: null })
const cvText = defineModel<string>('cvText', { default: '' })

defineEmits<{
  next: []
}>()

const { t } = useI18n()

const cvParsing = ref(false)
const cvError = ref('')
const dragOver = ref(false)

async function onFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await loadCv(file)
  input.value = ''
}

async function onDrop(event: DragEvent): Promise<void> {
  event.preventDefault()
  dragOver.value = false
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

function clearCv(): void {
  cvFile.value = null
  cvText.value = ''
  cvError.value = ''
}
</script>

<template>
  <div>
    <StepHead
      num="01 — CANDIDATE"
      :eyebrow="t('stepCandidateEyebrow')"
      :title="t('stepCandidateTitle')"
      :lede="t('stepCandidateLede')"
    />

    <!-- Drop zone (no file loaded) -->
    <label
      v-if="!cvFile || !cvText"
      class="relative block cursor-pointer transition-all duration-200"
      :style="{
        padding: '72px 56px',
        border: `1.5px dashed ${dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.28)'}`,
        background: dragOver ? 'rgba(140,40,40,0.04)' : 'rgba(255,250,238,0.5)',
      }"
      @dragenter.prevent="dragOver = true"
      @dragleave.prevent="dragOver = false"
      @dragover.prevent="dragOver = true"
      @drop="onDrop"
    >
      <input class="hidden" type="file" accept=".pdf,.docx,.txt" @change="onFileSelected" />

      <!-- Corner ticks -->
      <span v-for="(pos, i) in ['tl','tr','bl','br']" :key="i" class="absolute h-3.5 w-3.5" :style="{
        top: pos.startsWith('t') ? '8px' : undefined,
        bottom: pos.startsWith('b') ? '8px' : undefined,
        left: pos.endsWith('l') ? '8px' : undefined,
        right: pos.endsWith('r') ? '8px' : undefined,
        borderColor: dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.45)',
        borderStyle: 'solid',
        borderWidth: 0,
        borderTopWidth: pos.startsWith('t') ? '1px' : 0,
        borderBottomWidth: pos.startsWith('b') ? '1px' : 0,
        borderLeftWidth: pos.endsWith('l') ? '1px' : 0,
        borderRightWidth: pos.endsWith('r') ? '1px' : 0,
      }" />

      <div class="grid items-center gap-9" style="grid-template-columns: auto 1fr auto">
        <!-- Document icon -->
        <svg width="68" height="84" viewBox="0 0 68 84" fill="none">
          <rect x="2" y="2" width="64" height="80" rx="2" :stroke="dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.6)'" stroke-width="1" />
          <rect x="2" y="2" width="64" height="80" rx="2" fill="rgba(30,26,22,0.025)" />
          <line x1="14" y1="22" x2="46" y2="22" :stroke="dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.6)'" stroke-width="1" opacity="0.6" />
          <line x1="14" y1="30" x2="54" y2="30" :stroke="dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.6)'" stroke-width="1" opacity="0.4" />
          <line x1="14" y1="38" x2="42" y2="38" :stroke="dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.6)'" stroke-width="1" opacity="0.4" />
          <g transform="translate(34, 56)">
            <line x1="0" y1="-2" x2="0" y2="14" :stroke="dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.6)'" stroke-width="1.5" />
            <polyline points="-6,4 0,-2 6,4" :stroke="dragOver ? 'var(--accent)' : 'rgba(30,26,22,0.6)'" stroke-width="1.5" fill="none" />
          </g>
        </svg>

        <div>
          <div class="font-display text-[32px] italic tracking-tight" style="letter-spacing: -0.015em">
            {{ dragOver ? t('dropZoneActive') : t('dropZoneIdle') }}
          </div>
          <div class="mt-2.5 text-sm" style="color: rgba(30,26,22,0.7)">
            {{ t('dropZoneBrowse') }}
          </div>
          <div class="mt-4 flex gap-3.5 font-mono text-[10px] uppercase tracking-[0.18em]" style="color: var(--muted)">
            <span>PDF</span><span style="opacity: 0.35">·</span>
            <span>DOCX</span><span style="opacity: 0.35">·</span>
            <span>TXT</span>
          </div>
        </div>

        <div
          class="font-mono text-[11px] uppercase tracking-[0.2em]"
          style="padding: 12px 18px; border: 1px solid var(--accent); color: var(--accent)"
        >
          Browse ↗
        </div>
      </div>

      <div
        class="mt-9 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em]"
        style="padding-top: 18px; border-top: 1px dotted var(--hair); color: var(--muted)"
      >
        <span>{{ t('dropZoneTip') }}</span>
      </div>
    </label>

    <!-- Loaded state -->
    <div
      v-else
      style="border: 1px solid var(--hair); background: rgba(255,250,238,0.55); padding: 28px 32px"
    >
      <div class="flex items-baseline justify-between" style="border-bottom: 1px solid var(--hair); padding-bottom: 16px">
        <div>
          <div class="font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('candidateParsed') }}</div>
          <div class="mt-1 font-display text-4xl tracking-tight">{{ cvFile.name }}</div>
          <div class="mt-1 text-[15px]" style="color: rgba(30,26,22,0.75)">{{ cvText.length.toLocaleString() }} {{ t('candidateChars') }}</div>
        </div>
        <button
          class="cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em]"
          style="background: transparent; border: 1px solid var(--hair); padding: 8px 14px; color: var(--muted)"
          @click="clearCv"
        >
          {{ t('candidateReplace') }} ↻
        </button>
      </div>
    </div>

    <p v-if="cvError" class="mt-3 text-sm" style="color: oklch(50% 0.15 25)">{{ cvError }}</p>
    <p v-if="cvParsing" class="mt-3 font-mono text-xs" style="color: var(--muted)">{{ t('candidateParsing') }}</p>

    <!-- Nav -->
    <div
      class="mt-12 flex items-center justify-between"
      style="padding-top: 22px; border-top: 1px solid var(--hair)"
    >
      <span class="font-mono text-[11px] tracking-[0.06em]" style="color: var(--muted)">
        {{ cvFile && cvText ? t('candidateHintOk') : t('candidateHintDrop') }}
      </span>
      <button
        :disabled="!cvFile || !cvText"
        class="cursor-pointer border-none px-7 py-3.5 font-display text-[17px] italic"
        :style="{
          background: (!cvFile || !cvText) ? 'rgba(30,26,22,0.35)' : 'var(--ink)',
          color: 'var(--paper)',
          borderRadius: '2px',
          cursor: (!cvFile || !cvText) ? 'not-allowed' : 'pointer',
        }"
        @click="$emit('next')"
      >
        {{ t('stepCandidateNext') }} →
      </button>
    </div>
  </div>
</template>

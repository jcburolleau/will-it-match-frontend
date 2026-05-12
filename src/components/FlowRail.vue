<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import RowKV from './RowKV.vue'

const props = defineProps<{
  step: number
  hasCV: boolean
  hasJD: boolean
  done: boolean
  analyzing: boolean
  modelName: string
}>()

const emit = defineEmits<{
  goto: [step: number]
}>()

const { t } = useI18n()

const steps = [
  { k: 1, label: 'Candidate', note: 'the curriculum' },
  { k: 2, label: 'Posting', note: 'the role' },
  { k: 3, label: 'Run', note: 'the reading' },
  { k: 4, label: 'Verdict', note: 'the note' },
]

function reached(k: number): boolean {
  if (k === 1) return true
  if (k === 2) return props.hasCV
  if (k === 3) return props.analyzing
  if (k === 4) return props.done
  return false
}
</script>

<template>
  <aside>
    <div class="sticky top-6 flex flex-col gap-7">
      <div>
        <div class="font-mono text-[10px] uppercase tracking-[0.22em]" style="color: var(--muted)">{{ t('railSequence') }}</div>
        <ol class="m-0 mt-3 flex list-none flex-col gap-1 p-0">
          <li v-for="s in steps" :key="s.k">
            <button
              :disabled="!reached(s.k)"
              class="grid w-full items-baseline gap-2 border-none bg-transparent py-2.5 pl-3.5 text-left transition-colors duration-200"
              :style="{
                borderLeft: `2px solid ${s.k === step ? 'var(--accent)' : (reached(s.k) && s.k < step ? 'rgba(30,26,22,0.45)' : 'var(--hair)')}`,
                cursor: !reached(s.k) ? 'not-allowed' : 'pointer',
                color: !reached(s.k) ? 'rgba(30,26,22,0.35)' : 'inherit',
                fontFamily: 'inherit',
                gridTemplateColumns: '28px 1fr auto',
              }"
              @click="emit('goto', s.k)"
            >
              <span
                class="font-mono text-[11px] tracking-[0.06em]"
                :style="{ color: s.k === step ? 'var(--accent)' : 'var(--muted)' }"
              >
                {{ String(s.k).padStart(2, '0') }}
              </span>
              <span
                class="font-display text-lg"
                :style="{
                  fontStyle: s.k === step ? 'italic' : 'normal',
                  color: s.k === step ? 'var(--ink)' : (reached(s.k) && s.k < step ? 'rgba(30,26,22,0.7)' : 'var(--muted)'),
                }"
              >
                {{ s.label }}
              </span>
              <span class="font-mono text-[9px] uppercase tracking-[0.16em]" style="color: var(--muted)">
                {{ reached(s.k) && s.k < step ? 'done' : s.k === step ? 'now' : '' }}
              </span>
            </button>
          </li>
        </ol>
      </div>

      <div style="border-top: 1px solid var(--hair)" class="pt-4">
        <div class="font-mono text-[10px] uppercase tracking-[0.22em]" style="color: var(--muted)">{{ t('railPrivacy') }}</div>
        <p class="mt-2.5 text-[13px] leading-relaxed" style="color: rgba(30,26,22,0.78)">
          {{ t('railPrivacyText') }} <span style="color: var(--accent)">{{ t('railOffline') }}</span>.
        </p>
      </div>

      <div style="border-top: 1px solid var(--hair)" class="pt-4">
        <div class="font-mono text-[10px] uppercase tracking-[0.22em]" style="color: var(--muted)">{{ t('railSession') }}</div>
        <div class="mt-2.5 flex flex-col gap-1">
          <RowKV k="Model" :v="modelName || '—'" />
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import StepHead from './StepHead.vue'

defineProps<{
  analyzing: boolean
}>()

defineEmits<{
  cancel: []
}>()

const { t, locale } = useI18n()

const tick = ref(0)
let interval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  interval = setInterval(() => { tick.value++ }, 100)
})
onUnmounted(() => { if (interval) clearInterval(interval) })

const PASSES = [
  { label: 'runPass1', detail: 'runPass1Detail' },
  { label: 'runPass2', detail: 'runPass2Detail' },
  { label: 'runPass3', detail: 'runPass3Detail' },
  { label: 'runPass4', detail: 'runPass4Detail' },
  { label: 'runPass5', detail: 'runPass5Detail' },
  { label: 'runPass6', detail: 'runPass6Detail' },
]

const VERBS_EN = [
  'Weighing evidence…',
  'Comparing timelines…',
  'Reviewing the fine print…',
  'Cross-checking skills…',
  'Forming an opinion…',
  'Drafting the note…',
  'Almost there…',
]
const VERBS_ES = [
  'Sopesando evidencia…',
  'Comparando cronologías…',
  'Revisando la letra chica…',
  'Cruzando habilidades…',
  'Formando una opinión…',
  'Redactando la nota…',
  'Ya casi…',
]

// Ease-out curve hits 100% in ~18s, then switches to verb cycling
const seconds = computed(() => (tick.value * 100) / 1000)
const FILL_DURATION = 18
const done = computed(() => seconds.value >= FILL_DURATION)
function pct(): number {
  if (done.value) return 100
  const t = seconds.value / FILL_DURATION
  return Math.round(t * (2 - t) * 100)
}
function passIdx(): number {
  const ratio = done.value ? 1 : seconds.value / FILL_DURATION
  return Math.min(PASSES.length - 1, Math.floor(ratio * (PASSES.length + 0.99)))
}

const currentVerb = computed(() => {
  if (!done.value) return ''
  const list = locale.value === 'es' ? VERBS_ES : VERBS_EN
  const elapsed = seconds.value - FILL_DURATION
  const idx = Math.floor(elapsed / 3) % list.length
  return list[idx]
})

function phaseLabel(): string {
  const p = pct()
  if (p < 35) return t('runPhase1')
  if (p < 75) return t('runPhase2')
  if (p < 100) return t('runPhase3')
  return t('runPhase4')
}
</script>

<template>
  <div>
    <StepHead
      num="03 — RUN"
      :eyebrow="t('stepRunEyebrow')"
      :title="t('stepRunTitle')"
      :lede="t('stepRunLede')"
    />

    <div class="grid items-start gap-12" style="grid-template-columns: 1.2fr 1fr">
      <!-- Progress column -->
      <div>
        <!-- Big numeral / verb cycling -->
        <div class="mb-1.5 flex items-baseline gap-4" style="min-height: 96px">
          <template v-if="!done">
            <span class="font-display text-[96px] leading-none tracking-tighter" style="font-variant-numeric: tabular-nums">
              {{ String(pct()).padStart(2, '0') }}
            </span>
            <span class="font-mono text-[13px] tracking-[0.1em]" style="color: var(--muted)">% read</span>
            <span class="ml-2 font-display text-[22px] italic" style="color: var(--accent)">
              {{ phaseLabel() }}
            </span>
          </template>
          <template v-else>
            <span
              :key="currentVerb"
              class="verb-cycle font-display text-[38px] italic leading-tight"
              style="color: var(--accent)"
            >
              {{ currentVerb }}
            </span>
          </template>
        </div>

        <!-- Progress bar -->
        <div class="relative mt-5">
          <div class="h-0.5" style="background: var(--hair)">
            <div
              class="h-full transition-[width] duration-100"
              :style="{ width: `${pct()}%`, background: 'var(--accent)' }"
            />
          </div>
          <div class="mt-2 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em]" style="color: var(--muted)">
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>

        <!-- Passes -->
        <ol class="m-0 mt-9 flex list-none flex-col gap-0 p-0">
          <li
            v-for="(p, i) in PASSES"
            :key="p.label"
            class="grid items-baseline gap-3.5 py-3 transition-opacity duration-200"
            :style="{
              gridTemplateColumns: '36px 1fr auto',
              borderBottom: '1px solid var(--hair)',
              opacity: i > passIdx() ? 0.4 : 1,
            }"
          >
            <span
              class="font-mono text-[11px] tracking-[0.06em]"
              :style="{ color: i === passIdx() ? 'var(--accent)' : 'var(--muted)' }"
            >
              {{ String(i + 1).padStart(2, '0') }}
            </span>
            <div>
              <div
                class="font-display text-lg"
                :style="{
                  fontStyle: i === passIdx() ? 'italic' : 'normal',
                  color: i < passIdx() ? 'rgba(30,26,22,0.5)' : 'var(--ink)',
                  textDecoration: i < passIdx() ? 'line-through' : 'none',
                  textDecorationColor: 'rgba(30,26,22,0.35)',
                }"
              >
                {{ t(p.label) }}
              </div>
              <div class="mt-0.5 font-mono text-[11px]" style="color: var(--muted)">{{ t(p.detail) }}</div>
            </div>
            <span
              class="font-mono text-[10px] uppercase tracking-[0.16em]"
              :style="{ color: i === passIdx() ? 'var(--accent)' : 'var(--muted)' }"
            >
              {{ i < passIdx() ? '✓ done' : i === passIdx() ? '···' : '—' }}
            </span>
          </li>
        </ol>
      </div>

      <!-- Right column -->
      <div class="flex flex-col gap-6">
        <div style="border: 1px solid var(--hair); background: rgba(255,250,238,0.55); padding: 22px 24px">
          <div class="mb-3 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">
            <span>{{ t('runStream') }}</span>
            <span style="color: var(--accent)">● live</span>
          </div>
          <p class="m-0 min-h-[180px] font-body text-[14.5px] leading-relaxed" style="color: rgba(30,26,22,0.9)">
            {{ t('runStreamText') }}
            <span
              class="ml-0.5 inline-block h-4 w-2 translate-y-0.5"
              style="background: var(--accent); animation: blink 900ms infinite"
            />
          </p>
        </div>

        <div
          class="text-[13px] leading-relaxed"
          style="color: rgba(30,26,22,0.7); border-top: 1px solid var(--hair); padding-top: 16px"
        >
          <em class="font-display text-base">{{ t('runPatience') }}</em><br />
          {{ t('runPatienceDetail') }}
        </div>
      </div>
    </div>

    <!-- Cancel -->
    <div
      class="mt-12 flex items-center justify-between"
      style="padding-top: 22px; border-top: 1px solid var(--hair)"
    >
      <span class="font-mono text-[11px] uppercase tracking-[0.14em]" style="color: var(--muted)">
        {{ t('runAutoAdvance') }}
      </span>
      <button
        class="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em]"
        style="background: transparent; border: 1px solid var(--hair); padding: 10px 16px; color: var(--muted)"
        @click="$emit('cancel')"
      >
        {{ t('runStop') }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.verb-cycle {
  animation: verb-fade 600ms cubic-bezier(.2,.7,.2,1) both;
}
@keyframes verb-fade {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
</style>

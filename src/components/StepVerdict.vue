<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { MatchResult } from '../prompts/match'
import StepHead from './StepHead.vue'

const { result } = defineProps<{
  result: MatchResult
}>()

defineEmits<{
  reset: []
}>()

const { t } = useI18n()

function bandLabel(score: number): string {
  if (score >= 80) return t('scoreBandExcellent')
  if (score >= 60) return t('scoreBandGood')
  if (score >= 40) return t('scoreBandPartial')
  return t('scoreBandWeak')
}
</script>

<template>
  <div>
    <StepHead
      num="04 — VERDICT"
      :eyebrow="t('stepVerdictEyebrow')"
      :title="t('stepVerdictTitle')"
      :lede="t('stepVerdictLede')"
    />

    <!-- Score headline -->
    <div class="grid items-stretch gap-8" style="grid-template-columns: 1fr 220px; border-bottom: 1px solid var(--hair); padding-bottom: 28px">
      <div>
        <div class="font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('verdictOverall') }}</div>
        <div class="mt-1.5 flex items-baseline gap-3.5">
          <span class="font-display text-[96px] leading-none tracking-tighter">{{ result.overall_score }}</span>
          <span class="font-mono text-[13px] tracking-[0.08em]" style="color: var(--muted)">/ 100</span>
          <span class="ml-2 font-display text-[22px] italic" style="color: var(--accent)">{{ bandLabel(result.overall_score) }}</span>
        </div>
        <p class="mt-4 max-w-[540px] font-body text-base leading-relaxed" style="color: rgba(30,26,22,0.85)">
          {{ result.verdict }}
        </p>
      </div>
      <!-- Mini bar chart -->
      <div
        class="flex items-end gap-2.5 pl-5"
        style="height: 160px; border-left: 1px solid var(--hair)"
      >
        <div
          v-for="f in result.breakdown"
          :key="f.label"
          class="flex flex-1 flex-col items-center gap-1.5"
          style="height: 100%"
        >
          <div class="relative flex flex-1 w-full items-end">
            <div
              class="w-full transition-[height] duration-700"
              :style="{ height: `${f.value}%`, background: 'var(--accent)' }"
              style="transition-timing-function: cubic-bezier(.2,.7,.2,1)"
            />
          </div>
          <div class="font-mono text-[10px]" style="color: var(--muted)">{{ f.value }}</div>
        </div>
      </div>
    </div>

    <!-- Facets table -->
    <div class="mt-7">
      <div class="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('verdictFacets') }}</div>
      <table class="w-full border-collapse font-body text-sm">
        <thead>
          <tr class="text-left font-mono text-[10px] uppercase tracking-[0.14em]" style="color: var(--muted)">
            <th class="py-2 font-normal">{{ t('verdictFacet') }}</th>
            <th class="py-2 font-normal">{{ t('verdictReading') }}</th>
            <th class="w-[220px] py-2 font-normal">{{ t('verdictStrength') }}</th>
            <th class="w-[60px] py-2 text-right font-normal">{{ t('verdictScore') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="f in result.breakdown" :key="f.label" style="border-top: 1px solid var(--hair)">
            <td class="w-[180px] py-3 font-display text-base italic">{{ f.label }}</td>
            <td class="py-3" style="color: rgba(30,26,22,0.78)">{{ f.note }}</td>
            <td class="py-3 pr-4">
              <div class="h-[3px] overflow-hidden rounded-full" style="background: rgba(30,26,22,0.06)">
                <div
                  class="h-full rounded-full transition-[width] duration-700"
                  :style="{ width: `${f.value}%`, background: 'var(--accent)' }"
                  style="transition-timing-function: cubic-bezier(.2,.7,.2,1)"
                />
              </div>
            </td>
            <td class="py-3 text-right font-mono text-[13px]" style="color: rgba(30,26,22,0.85)">{{ f.value }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Chips: matched / missing -->
    <div class="mt-7 grid grid-cols-2 gap-7" style="border-top: 1px solid var(--hair); padding-top: 22px">
      <div>
        <div class="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('verdictCarried') }}</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="m in result.matched" :key="m"
            class="rounded-sm font-mono text-[11px] tracking-[0.04em]"
            style="padding: 5px 10px; border: 1px solid var(--hair); color: rgba(30,26,22,0.85)"
          >{{ m }}</span>
        </div>
      </div>
      <div>
        <div class="mb-3 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('verdictRaising') }}</div>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="m in result.missing" :key="m"
            class="rounded-sm font-mono text-[11px] tracking-[0.04em]"
            style="padding: 5px 10px; border: 1px solid var(--accent); color: var(--accent); background: rgba(120,30,40,0.04)"
          >{{ m }}</span>
        </div>
      </div>
    </div>

    <!-- Evidence table -->
    <div class="mt-8">
      <div class="mb-2.5 font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('verdictEvidence') }}</div>
      <div
        class="grid py-2 font-mono text-[10px] uppercase tracking-[0.14em]"
        style="grid-template-columns: 140px 1fr 1fr 60px; border-bottom: 1px solid var(--hair); color: var(--muted)"
      >
        <span>{{ t('verdictTag') }}</span>
        <span>CV</span>
        <span>{{ t('jdSection') }}</span>
        <span class="text-right">{{ t('verdictNote') }}</span>
      </div>
      <div
        v-for="(e, i) in result.evidence" :key="i"
        class="grid items-start gap-4 py-4"
        style="grid-template-columns: 140px 1fr 1fr 60px; border-bottom: 1px solid var(--hair)"
      >
        <div class="font-display text-base italic">{{ e.tag }}</div>
        <div class="font-body text-[13.5px] leading-relaxed" style="color: rgba(30,26,22,0.85)">{{ e.cv }}</div>
        <div class="font-body text-[13.5px] leading-relaxed" style="color: rgba(30,26,22,0.85)">{{ e.jd }}</div>
        <div
          class="text-right font-mono text-[10px] uppercase tracking-[0.14em]"
          :style="{ color: e.verdict === 'match' ? 'var(--accent)' : 'rgba(140,40,40,0.85)' }"
        >
          {{ e.verdict === 'match' ? '✓ match' : '△ gap' }}
        </div>
      </div>
    </div>

    <!-- Actions -->
    <div
      class="mt-12 flex items-center justify-between"
      style="padding-top: 22px; border-top: 1px solid var(--hair)"
    >
      <button
        class="cursor-pointer border-none bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.16em]"
        style="color: var(--muted)"
        @click="$emit('reset')"
      >
        ↺ {{ t('verdictNewReading') }}
      </button>
    </div>
  </div>
</template>

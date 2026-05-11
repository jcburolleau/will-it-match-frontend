<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import type { MatchResult } from '../prompts/match'
import { getScoreBand } from '../composables/useScoreBand'
import ScoreRing from './ScoreRing.vue'
import ResultListCard from './ResultListCard.vue'

const props = defineProps<{
  result: MatchResult
}>()

const { t } = useI18n()

const displayScore = ref(0)
const band = computed(() => getScoreBand(props.result.overall_score))

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

onMounted(() => {
  if (reducedMotion) {
    displayScore.value = props.result.overall_score
    return
  }

  const proxy = { value: 0 }
  gsap.to(proxy, {
    value: props.result.overall_score,
    duration: 1.4,
    ease: 'power2.out',
    onUpdate: () => {
      displayScore.value = proxy.value
    },
  })

  const cards = document.querySelectorAll('.result-card')
  if (cards.length) {
    gsap.from(cards, {
      y: 24,
      opacity: 0,
      duration: 0.55,
      stagger: 0.11,
      ease: 'power2.out',
      clearProps: 'all',
    })
  }
})
</script>

<template>
  <section class="mb-6 space-y-4">
    <div class="result-card rounded-2xl border border-slate-200 bg-white p-6">
      <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
        <ScoreRing
          :display-score="displayScore"
          :ring-stroke="band.ringStroke"
          :ring-track="band.ringTrack"
          :number-text="band.numberText"
        />
        <div class="flex-1 text-center sm:text-left">
          <p class="text-sm font-medium text-slate-500">{{ t('resultScore') }}</p>
          <span
            class="mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold"
            :class="[band.badgeBg, band.badgeText]"
          >
            {{ t(band.labelKey) }}
          </span>
          <p
            class="mt-3 border-l-4 pl-3 text-left text-base leading-relaxed text-slate-700"
            :class="band.summaryBorder"
          >
            {{ result.summary }}
          </p>
        </div>
      </div>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <ResultListCard
        :title="t('resultStrengths')"
        :items="result.strengths"
        accent="emerald"
      >
        <template #icon>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
        </template>
      </ResultListCard>

      <ResultListCard
        :title="t('resultGaps')"
        :items="result.gaps"
        accent="amber"
      >
        <template #icon>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fill-rule="evenodd"
              d="M8.5 2.6a1.7 1.7 0 0 1 3 0l6.6 11.7a1.7 1.7 0 0 1-1.5 2.5H3.4a1.7 1.7 0 0 1-1.5-2.5L8.5 2.6zM10 7a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
              clip-rule="evenodd"
            />
          </svg>
        </template>
      </ResultListCard>

      <ResultListCard
        :title="t('resultRecommendations')"
        :items="result.recommendations"
        accent="indigo"
      >
        <template #icon>
          <svg class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              d="M10 2a6 6 0 0 0-3.5 10.9V14a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-1.1A6 6 0 0 0 10 2zM8 17a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"
            />
          </svg>
        </template>
      </ResultListCard>
    </div>
  </section>
</template>

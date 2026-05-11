<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { gsap } from 'gsap'
import { checkConnection, chat, type OllamaModel } from '../services/ollama'
import { extractText } from '../services/parseCv'
import { useSettings } from '../composables/useSettings'
import { buildMatchMessages, parseMatchResponse, type MatchResult } from '../prompts/match'

const { t, locale } = useI18n()
const { ollamaBaseUrl, selectedModel } = useSettings()

const cvFile = ref<File | null>(null)
const cvText = ref('')
const cvParsing = ref(false)
const cvError = ref('')
const isCvDragging = ref(false)

const jdText = ref('')

const models = ref<OllamaModel[]>([])
const connection = ref<
  | { state: 'checking' }
  | { state: 'ok' }
  | { state: 'error'; message: string }
>({ state: 'checking' })

const analyzing = ref(false)
const parsed = ref<MatchResult | null>(null)
const parseFailed = ref(false)
const generalError = ref('')
const abortController = ref<AbortController | null>(null)

const settingsOpen = ref(false)
const draftBaseUrl = ref(ollamaBaseUrl.value)

const resultColEl = ref<HTMLElement | null>(null)
const displayScore = ref(0)

const showResultPane = computed(
  () => analyzing.value || !!parsed.value || parseFailed.value,
)

const reducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const currentLocale = computed({
  get: () => (locale.value === 'en' ? 'en' : 'es') as 'en' | 'es',
  set: (value: 'es' | 'en') => {
    locale.value = value
    localStorage.setItem('locale', value)
  },
})

interface ScoreBand {
  labelKey: 'scoreBandExcellent' | 'scoreBandGood' | 'scoreBandPartial' | 'scoreBandWeak'
  ringStroke: string
  ringTrack: string
  numberText: string
  badgeBg: string
  badgeText: string
  summaryBorder: string
}

const scoreBand = computed<ScoreBand>(() => {
  const s = parsed.value?.overall_score ?? 0
  if (s >= 80) {
    return {
      labelKey: 'scoreBandExcellent',
      ringStroke: 'stroke-emerald-500',
      ringTrack: 'stroke-emerald-100',
      numberText: 'text-emerald-700',
      badgeBg: 'bg-emerald-100',
      badgeText: 'text-emerald-800',
      summaryBorder: 'border-emerald-400',
    }
  }
  if (s >= 60) {
    return {
      labelKey: 'scoreBandGood',
      ringStroke: 'stroke-lime-500',
      ringTrack: 'stroke-lime-100',
      numberText: 'text-lime-700',
      badgeBg: 'bg-lime-100',
      badgeText: 'text-lime-800',
      summaryBorder: 'border-lime-400',
    }
  }
  if (s >= 40) {
    return {
      labelKey: 'scoreBandPartial',
      ringStroke: 'stroke-amber-500',
      ringTrack: 'stroke-amber-100',
      numberText: 'text-amber-700',
      badgeBg: 'bg-amber-100',
      badgeText: 'text-amber-800',
      summaryBorder: 'border-amber-400',
    }
  }
  return {
    labelKey: 'scoreBandWeak',
    ringStroke: 'stroke-rose-500',
    ringTrack: 'stroke-rose-100',
    numberText: 'text-rose-700',
    badgeBg: 'bg-rose-100',
    badgeText: 'text-rose-800',
    summaryBorder: 'border-rose-400',
  }
})

const ringCircumference = 2 * Math.PI * 42
const ringOffset = computed(() => {
  const score = Math.max(0, Math.min(100, displayScore.value))
  return ringCircumference * (1 - score / 100)
})

async function refreshModels(): Promise<void> {
  connection.value = { state: 'checking' }
  const status = await checkConnection(ollamaBaseUrl.value)
  if (!status.ok) {
    connection.value = { state: 'error', message: status.message }
    models.value = []
    return
  }
  connection.value = { state: 'ok' }
  models.value = status.models
  const installedNames = status.models.map((m) => m.name)
  if (!installedNames.includes(selectedModel.value)) {
    selectedModel.value = installedNames[0] ?? ''
  }
}

onMounted(refreshModels)

async function onCvFileSelected(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await loadCv(file)
}

async function onCvDrop(event: DragEvent): Promise<void> {
  event.preventDefault()
  isCvDragging.value = false
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

async function analyze(): Promise<void> {
  generalError.value = ''
  parsed.value = null
  parseFailed.value = false
  displayScore.value = 0

  if (!cvText.value.trim()) {
    generalError.value = t('errorNoCv')
    return
  }
  if (!jdText.value.trim()) {
    generalError.value = t('errorNoJd')
    return
  }
  if (!selectedModel.value) {
    generalError.value = t('errorNoModel')
    return
  }

  const controller = new AbortController()
  abortController.value = controller
  analyzing.value = true
  try {
    const messages = buildMatchMessages({
      cvText: cvText.value,
      jdText: jdText.value,
      locale: currentLocale.value,
    })
    const full = await chat({
      baseUrl: ollamaBaseUrl.value,
      model: selectedModel.value,
      messages,
      signal: controller.signal,
    })
    const result = parseMatchResponse(full)
    if (result) parsed.value = result
    else parseFailed.value = true
  } catch (err) {
    if ((err as Error).name === 'AbortError') return
    generalError.value = err instanceof Error ? err.message : String(err)
  } finally {
    analyzing.value = false
    abortController.value = null
  }
}

function cancelAnalysis(): void {
  abortController.value?.abort()
}

function openSettings(): void {
  draftBaseUrl.value = ollamaBaseUrl.value
  settingsOpen.value = true
}

async function saveSettings(): Promise<void> {
  ollamaBaseUrl.value = draftBaseUrl.value.trim() || 'http://localhost:11434'
  settingsOpen.value = false
  await refreshModels()
}

watch(showResultPane, async (v) => {
  if (!v) return
  await nextTick()
  if (window.matchMedia('(max-width: 767px)').matches) {
    resultColEl.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
})

watch(parsed, async (newVal) => {
  if (!newVal) {
    displayScore.value = 0
    return
  }
  await nextTick()

  if (reducedMotion) {
    displayScore.value = newVal.overall_score
  } else {
    const proxy = { value: 0 }
    gsap.to(proxy, {
      value: newVal.overall_score,
      duration: 1.4,
      ease: 'power2.out',
      onUpdate: () => {
        displayScore.value = proxy.value
      },
    })
  }

  if (!reducedMotion) {
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
  }
})
</script>

<template>
  <main
    class="layout-container mx-auto px-4 py-6"
    :class="{ 'is-split': showResultPane }"
  >
    <header class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">{{ t('appTitle') }}</h1>
        <p class="text-sm text-slate-600">{{ t('subtitle') }}</p>
      </div>
      <div class="flex items-center gap-3 text-sm">
        <label class="flex items-center gap-2">
          <span>{{ t('language') }}</span>
          <select
            v-model="currentLocale"
            class="rounded border border-slate-400 px-2 py-1 text-slate-900"
          >
            <option value="es">ES</option>
            <option value="en">EN</option>
          </select>
        </label>
        <button
          class="rounded border border-slate-400 px-3 py-1 text-slate-700 hover:bg-slate-100"
          @click="openSettings"
        >
          {{ t('settings') }}
        </button>
      </div>
    </header>

    <section
      v-if="connection.state === 'error'"
      class="mb-6 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-800"
    >
      <p class="font-semibold">
        {{ t('connectionError', { url: ollamaBaseUrl }) }}
      </p>
      <p class="mt-1">{{ t('connectionHelp') }}</p>
      <p class="mt-2 font-mono text-xs text-red-700">{{ connection.message }}</p>
      <button
        class="mt-3 rounded border border-red-400 bg-white px-3 py-1 text-red-700 hover:bg-red-100"
        @click="refreshModels"
      >
        {{ t('refreshModels') }}
      </button>
    </section>

    <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
      <h2 class="mb-3 text-lg font-semibold text-slate-900">{{ t('modelSection') }}</h2>
      <div v-if="connection.state === 'ok' && models.length === 0" class="text-sm text-slate-700">
        <p>{{ t('noModels') }}</p>
        <pre class="mt-2 rounded bg-slate-100 px-3 py-2 font-mono text-xs">{{ t('noModelsExample') }}</pre>
        <button
          class="mt-3 rounded border border-slate-400 px-3 py-1 hover:bg-slate-100"
          @click="refreshModels"
        >
          {{ t('refreshModels') }}
        </button>
      </div>
      <div v-else-if="connection.state === 'ok'" class="flex items-center gap-3">
        <label class="flex flex-1 items-center gap-2">
          <span class="text-sm text-slate-700">{{ t('modelLabel') }}</span>
          <select
            v-model="selectedModel"
            class="flex-1 rounded border border-slate-400 px-3 py-2"
          >
            <option value="" disabled>{{ t('modelPlaceholder') }}</option>
            <option v-for="m in models" :key="m.name" :value="m.name">{{ m.name }}</option>
          </select>
        </label>
        <button
          class="rounded border border-slate-400 px-3 py-2 text-sm hover:bg-slate-100"
          @click="refreshModels"
        >
          {{ t('refreshModels') }}
        </button>
      </div>
    </section>

    <div class="layout" :class="{ 'is-split': showResultPane }">
      <div class="form-col">
        <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 class="mb-3 text-lg font-semibold text-slate-900">{{ t('cvSection') }}</h2>
          <label
            class="flex min-h-32 cursor-pointer items-center justify-center rounded-2xl border-2 border-dashed px-6 py-6 text-center transition"
            :class="isCvDragging ? 'border-blue-700 bg-blue-50' : 'border-slate-400 bg-slate-50'"
            @dragover.prevent="isCvDragging = true"
            @dragleave.prevent="isCvDragging = false"
            @drop="onCvDrop"
          >
            <input class="hidden" type="file" accept=".pdf,.docx,.txt" @change="onCvFileSelected" />
            <span class="text-slate-700">
              <template v-if="cvParsing">…</template>
              <template v-else-if="cvFile && cvText">
                {{ t('cvParsed', { chars: cvText.length, name: cvFile.name }) }}
              </template>
              <template v-else>{{ t('cvDropzone') }}</template>
            </span>
          </label>
          <p v-if="cvError" class="mt-2 text-sm text-red-600">{{ cvError }}</p>
        </section>

        <section class="mb-6 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 class="mb-3 text-lg font-semibold text-slate-900">{{ t('jdSection') }}</h2>
          <textarea
            v-model="jdText"
            rows="10"
            class="w-full rounded-lg border border-slate-300 p-3 text-sm"
            :placeholder="t('jdPlaceholder')"
          />
        </section>

        <div class="mb-6 flex items-center justify-end gap-3">
          <p v-if="generalError" class="mr-auto text-sm text-red-600">{{ generalError }}</p>
          <button
            v-if="analyzing"
            class="rounded-2xl border border-slate-400 px-4 py-3 text-slate-700 hover:bg-slate-100"
            @click="cancelAnalysis"
          >
            {{ t('cancel') }}
          </button>
          <button
            class="rounded-2xl bg-blue-600 px-6 py-3 text-lg font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="analyzing"
            @click="analyze"
          >
            {{ analyzing ? t('analyzing') : t('analyze') }}
          </button>
        </div>
      </div>

      <Transition name="result-pane">
        <div v-if="showResultPane" ref="resultColEl" class="result-col">
          <section
            v-if="analyzing"
            class="mb-6 rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div class="flex items-center gap-3">
              <svg
                class="h-6 w-6 animate-spin text-blue-600"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-opacity="0.25" />
                <path
                  d="M22 12a10 10 0 0 1-10 10"
                  stroke="currentColor"
                  stroke-width="3"
                  stroke-linecap="round"
                />
              </svg>
              <div>
                <p class="text-base font-medium text-slate-900">{{ t('loadingTitle') }}</p>
                <p class="text-sm text-slate-500">{{ t('loadingHint') }}</p>
              </div>
            </div>
            <div class="mt-6 space-y-3">
              <div class="h-20 animate-pulse rounded-xl bg-slate-100" />
              <div class="space-y-3">
                <div class="h-24 animate-pulse rounded-xl bg-slate-100" />
                <div class="h-24 animate-pulse rounded-xl bg-slate-100" style="animation-delay: 150ms" />
                <div class="h-24 animate-pulse rounded-xl bg-slate-100" style="animation-delay: 300ms" />
              </div>
            </div>
          </section>

          <section v-if="parsed && !analyzing" class="mb-6 space-y-4">
            <div class="result-card rounded-2xl border border-slate-200 bg-white p-6">
              <div class="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:gap-8">
                <div class="relative h-32 w-32 shrink-0">
                  <svg viewBox="0 0 100 100" class="h-full w-full -rotate-90">
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke-width="10"
                      :class="scoreBand.ringTrack"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke-width="10"
                      stroke-linecap="round"
                      :class="scoreBand.ringStroke"
                      :stroke-dasharray="ringCircumference"
                      :stroke-dashoffset="ringOffset"
                    />
                  </svg>
                  <div class="absolute inset-0 flex flex-col items-center justify-center">
                    <span class="text-3xl font-bold tabular-nums" :class="scoreBand.numberText">
                      {{ Math.round(displayScore) }}
                    </span>
                    <span class="text-xs font-medium text-slate-500">/ 100</span>
                  </div>
                </div>
                <div class="flex-1 text-center sm:text-left">
                  <p class="text-sm font-medium text-slate-500">{{ t('resultScore') }}</p>
                  <span
                    class="mt-1 inline-block rounded-full px-3 py-1 text-sm font-semibold"
                    :class="[scoreBand.badgeBg, scoreBand.badgeText]"
                  >
                    {{ t(scoreBand.labelKey) }}
                  </span>
                  <p
                    class="mt-3 border-l-4 pl-3 text-left text-base leading-relaxed text-slate-700"
                    :class="scoreBand.summaryBorder"
                  >
                    {{ parsed.summary }}
                  </p>
                </div>
              </div>
            </div>

            <div class="result-card rounded-2xl border border-emerald-200 bg-emerald-50/60 p-5">
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-emerald-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm3.7-9.3a1 1 0 0 0-1.4-1.4L9 10.6 7.7 9.3a1 1 0 0 0-1.4 1.4l2 2a1 1 0 0 0 1.4 0l4-4z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h3 class="text-sm font-semibold text-emerald-900">{{ t('resultStrengths') }}</h3>
                </div>
                <span class="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
                  {{ parsed.strengths.length }}
                </span>
              </div>
              <ul class="space-y-2">
                <li
                  v-for="(s, i) in parsed.strengths"
                  :key="i"
                  class="flex gap-2 text-sm leading-snug text-slate-800"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span>{{ s }}</span>
                </li>
              </ul>
            </div>

            <div class="result-card rounded-2xl border border-amber-200 bg-amber-50/60 p-5">
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M8.5 2.6a1.7 1.7 0 0 1 3 0l6.6 11.7a1.7 1.7 0 0 1-1.5 2.5H3.4a1.7 1.7 0 0 1-1.5-2.5L8.5 2.6zM10 7a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V8a1 1 0 0 1 1-1zm0 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <h3 class="text-sm font-semibold text-amber-900">{{ t('resultGaps') }}</h3>
                </div>
                <span class="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                  {{ parsed.gaps.length }}
                </span>
              </div>
              <ul class="space-y-2">
                <li
                  v-for="(g, i) in parsed.gaps"
                  :key="i"
                  class="flex gap-2 text-sm leading-snug text-slate-800"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                  <span>{{ g }}</span>
                </li>
              </ul>
            </div>

            <div class="result-card rounded-2xl border border-indigo-200 bg-indigo-50/60 p-5">
              <div class="mb-3 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <svg class="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      d="M10 2a6 6 0 0 0-3.5 10.9V14a1 1 0 0 0 1 1h5a1 1 0 0 0 1-1v-1.1A6 6 0 0 0 10 2zM8 17a1 1 0 0 1 1-1h2a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1z"
                    />
                  </svg>
                  <h3 class="text-sm font-semibold text-indigo-900">{{ t('resultRecommendations') }}</h3>
                </div>
                <span class="rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-semibold text-indigo-800">
                  {{ parsed.recommendations.length }}
                </span>
              </div>
              <ul class="space-y-2">
                <li
                  v-for="(r, i) in parsed.recommendations"
                  :key="i"
                  class="flex gap-2 text-sm leading-snug text-slate-800"
                >
                  <span class="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-500" />
                  <span>{{ r }}</span>
                </li>
              </ul>
            </div>
          </section>

          <section
            v-if="parseFailed && !analyzing"
            class="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5"
          >
            <p class="text-sm text-amber-900">{{ t('parseError') }}</p>
            <button
              class="mt-3 rounded-lg border border-amber-400 bg-white px-3 py-1.5 text-sm text-amber-900 hover:bg-amber-100"
              @click="analyze"
            >
              {{ t('retry') }}
            </button>
          </section>
        </div>
      </Transition>
    </div>

    <div
      v-if="settingsOpen"
      class="fixed inset-0 z-10 flex items-center justify-center bg-slate-900/50 p-4"
      @click.self="settingsOpen = false"
    >
      <div class="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <h3 class="mb-4 text-lg font-semibold text-slate-900">{{ t('settings') }}</h3>
        <label class="mb-4 block">
          <span class="mb-1 block text-sm text-slate-700">{{ t('ollamaUrlLabel') }}</span>
          <input
            v-model="draftBaseUrl"
            class="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            placeholder="http://localhost:11434"
          />
        </label>
        <div class="flex justify-end gap-2">
          <button
            class="rounded border border-slate-400 px-3 py-2 text-sm hover:bg-slate-100"
            @click="settingsOpen = false"
          >
            {{ t('close') }}
          </button>
          <button
            class="rounded bg-slate-900 px-3 py-2 text-sm text-white hover:bg-slate-800"
            @click="saveSettings"
          >
            {{ t('save') }}
          </button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.layout-container {
  max-width: 48rem;
  transition: max-width 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

.layout-container.is-split {
  max-width: 80rem;
}

.layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0;
  align-items: start;
  transition:
    grid-template-columns 600ms cubic-bezier(0.4, 0, 0.2, 1),
    gap 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

@media (min-width: 768px) {
  .layout.is-split {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 1.5rem;
  }

  .layout.is-split .form-col {
    position: sticky;
    top: 1.5rem;
    align-self: start;
  }
}

.result-col {
  min-width: 0;
}

.result-pane-enter-active {
  transition:
    opacity 500ms cubic-bezier(0.4, 0, 0.2, 1) 250ms,
    transform 500ms cubic-bezier(0.4, 0, 0.2, 1) 250ms;
}

.result-pane-leave-active {
  transition:
    opacity 300ms ease,
    transform 300ms ease;
}

.result-pane-enter-from {
  opacity: 0;
  transform: translateX(24px);
}

.result-pane-leave-to {
  opacity: 0;
  transform: translateX(24px);
}

@media (prefers-reduced-motion: reduce) {
  .layout-container,
  .layout,
  .result-pane-enter-active,
  .result-pane-leave-active {
    transition: none !important;
  }

  .result-pane-enter-from,
  .result-pane-leave-to {
    transform: none !important;
  }
}
</style>

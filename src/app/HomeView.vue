<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkConnection, chat, type OllamaModel } from '../services/ollama'
import { useSettings } from '../composables/useSettings'
import { buildMatchMessages, parseMatchResponse, type MatchResult } from '../prompts/match'
import AppHeader from '../components/AppHeader.vue'
import ConnectionBanner from '../components/ConnectionBanner.vue'
import ModelSection from '../components/ModelSection.vue'
import FormView from '../components/FormView.vue'
import AnalysisView from '../components/AnalysisView.vue'
import SettingsModal from '../components/SettingsModal.vue'

const { t, locale } = useI18n()
const { ollamaBaseUrl, selectedModel } = useSettings()

const cvFile = ref<File | null>(null)
const cvText = ref('')
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

const showResultPane = computed(
  () => analyzing.value || !!parsed.value || parseFailed.value,
)

const currentLocale = computed(
  () => (locale.value === 'en' ? 'en' : 'es') as 'en' | 'es',
)

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

async function analyze(): Promise<void> {
  generalError.value = ''
  parsed.value = null
  parseFailed.value = false

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

function resetToForm(): void {
  parsed.value = null
  parseFailed.value = false
  generalError.value = ''
}

async function onSaveSettings(url: string): Promise<void> {
  ollamaBaseUrl.value = url
  settingsOpen.value = false
  await refreshModels()
}
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-6">
    <AppHeader @open-settings="settingsOpen = true" />

    <ConnectionBanner
      v-if="connection.state === 'error'"
      :url="ollamaBaseUrl"
      :message="connection.message"
      @retry="refreshModels"
    />

    <ModelSection
      :connection="connection"
      :models="models"
      v-model:selected-model="selectedModel"
      @refresh="refreshModels"
    />

    <Transition name="view-swap" mode="out-in">
      <FormView
        v-if="!showResultPane"
        key="form"
        v-model:cv-file="cvFile"
        v-model:cv-text="cvText"
        v-model:jd-text="jdText"
        :analyzing="analyzing"
        :general-error="generalError"
        @analyze="analyze"
      />
      <AnalysisView
        v-else
        key="analysis"
        :analyzing="analyzing"
        :parsed="parsed"
        :parse-failed="parseFailed"
        @cancel="cancelAnalysis"
        @reset="resetToForm"
        @retry="analyze"
      />
    </Transition>

    <SettingsModal
      :open="settingsOpen"
      :initial-url="ollamaBaseUrl"
      @close="settingsOpen = false"
      @save="onSaveSettings"
    />
  </main>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .view-swap-enter-active,
  .view-swap-leave-active {
    transition:
      opacity 300ms cubic-bezier(0.4, 0, 0.2, 1),
      transform 300ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  .view-swap-enter-from {
    opacity: 0;
    transform: translateY(16px);
  }

  .view-swap-leave-to {
    opacity: 0;
    transform: translateY(-16px);
  }
}
</style>

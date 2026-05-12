<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { checkConnection, chat, type OllamaModel } from '../services/ollama'
import { useSettings } from '../composables/useSettings'
import { buildMatchMessages, parseMatchResponse, type MatchResult } from '../prompts/match'
import FlowHeader from '../components/FlowHeader.vue'
import FlowRail from '../components/FlowRail.vue'
import FlowFooter from '../components/FlowFooter.vue'
import StepCandidate from '../components/StepCandidate.vue'
import StepPosting from '../components/StepPosting.vue'
import StepRun from '../components/StepRun.vue'
import StepVerdict from '../components/StepVerdict.vue'
import SettingsModal from '../components/SettingsModal.vue'
import ConnectionBanner from '../components/ConnectionBanner.vue'

const { t, locale } = useI18n()
const { ollamaBaseUrl, selectedModel } = useSettings()

const step = ref(1)
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

const hasCV = computed(() => !!(cvFile.value && cvText.value))
const hasJD = computed(() => jdText.value.trim().length >= 40)

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

function gotoStep(n: number): void {
  if (n === 3 && !analyzing.value) return
  if (n >= 3 && !hasCV.value) return
  if (n >= 3 && !hasJD.value) return
  if (n === 4 && !parsed.value) return
  step.value = n
}

async function runAnalysis(): Promise<void> {
  generalError.value = ''
  parsed.value = null
  parseFailed.value = false

  if (!cvText.value.trim()) { generalError.value = t('errorNoCv'); return }
  if (!jdText.value.trim()) { generalError.value = t('errorNoJd'); return }
  if (!selectedModel.value) { generalError.value = t('errorNoModel'); return }

  step.value = 3
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
    if (result) {
      parsed.value = result
      step.value = 4
    } else {
      parseFailed.value = true
    }
  } catch (err) {
    if ((err as Error).name === 'AbortError') { step.value = 2; return }
    generalError.value = err instanceof Error ? err.message : String(err)
    step.value = 2
  } finally {
    analyzing.value = false
    abortController.value = null
  }
}

function cancelAnalysis(): void {
  abortController.value?.abort()
}

function resetAll(): void {
  step.value = 1
  cvFile.value = null
  cvText.value = ''
  jdText.value = ''
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
  <div class="box-border min-h-screen" style="background: var(--paper)">
    <div
      class="paper-card relative mx-auto"
      style="max-width: 1320px; background: var(--paper)"
    >
      <FlowHeader
        :step="step"
        :model-name="selectedModel"
        @open-settings="settingsOpen = true"
      />

      <ConnectionBanner
        v-if="connection.state === 'error'"
        :url="ollamaBaseUrl"
        :message="connection.message"
        @retry="refreshModels"
      />

      <!-- Model selector (compact, above the grid) -->
      <div
        v-if="connection.state === 'ok' && models.length > 0"
        class="flex items-center gap-3 px-10 py-3 font-mono text-xs"
        style="border-bottom: 1px solid var(--hair)"
      >
        <span class="uppercase tracking-[0.12em]" style="color: var(--muted)">{{ t('modelLabel') }}</span>
        <select
          v-model="selectedModel"
          class="cursor-pointer rounded-sm border px-2 py-1 font-mono text-xs"
          style="border-color: var(--hair); background: transparent; color: var(--ink)"
        >
          <option value="" disabled>{{ t('modelPlaceholder') }}</option>
          <option v-for="m in models" :key="m.name" :value="m.name" style="background: var(--paper)">{{ m.name }}</option>
        </select>
        <button
          class="cursor-pointer border-none bg-transparent p-0 font-mono text-[10px] uppercase tracking-[0.14em]"
          style="color: var(--muted)"
          @click="refreshModels"
        >
          {{ t('refreshModels') }}
        </button>
      </div>

      <div
        class="grid"
        style="grid-template-columns: 240px 1fr; gap: 64px; padding: 52px 64px 88px"
      >
        <FlowRail
          :step="step"
          :has-c-v="hasCV"
          :has-j-d="hasJD"
          :done="!!parsed"
          :analyzing="analyzing"
          :model-name="selectedModel"
          @goto="gotoStep"
        />

        <Transition name="step" mode="out-in">
          <main
            :key="step"
            class="min-h-[720px]"
          >
            <StepCandidate
              v-if="step === 1"
              v-model:cv-file="cvFile"
              v-model:cv-text="cvText"
              @next="gotoStep(2)"
            />
            <StepPosting
              v-else-if="step === 2"
              v-model:jd-text="jdText"
              @back="gotoStep(1)"
              @next="runAnalysis"
            />
            <StepRun
              v-else-if="step === 3"
              :analyzing="analyzing"
              @cancel="cancelAnalysis"
            />
            <StepVerdict
              v-else-if="step === 4 && parsed"
              :result="parsed"
              @reset="resetAll"
            />
          </main>
        </Transition>
      </div>

      <FlowFooter />
    </div>

    <SettingsModal
      :open="settingsOpen"
      :initial-url="ollamaBaseUrl"
      @close="settingsOpen = false"
      @save="onSaveSettings"
    />
  </div>
</template>

<style scoped>
.paper-card {
  background-image:
    linear-gradient(180deg, rgba(150,120,80,0.04), transparent 320px),
    url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence baseFrequency='1.1' numOctaves='2' seed='5'/><feColorMatrix values='0 0 0 0 0.15  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.05 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
}

.step-enter-active {
  transition: opacity 360ms cubic-bezier(.2,.7,.2,1), transform 360ms cubic-bezier(.2,.7,.2,1);
}
.step-leave-active {
  transition: opacity 200ms ease-in;
}
.step-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.step-leave-to {
  opacity: 0;
}
</style>

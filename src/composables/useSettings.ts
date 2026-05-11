import { ref, watch } from 'vue'

const DEFAULT_BASE_URL = 'http://localhost:11434'
const BASE_URL_KEY = 'ollamaBaseUrl'
const MODEL_KEY = 'ollamaSelectedModel'

const ollamaBaseUrl = ref(localStorage.getItem(BASE_URL_KEY) ?? DEFAULT_BASE_URL)
const selectedModel = ref(localStorage.getItem(MODEL_KEY) ?? '')

watch(ollamaBaseUrl, (value) => {
  localStorage.setItem(BASE_URL_KEY, value)
})
watch(selectedModel, (value) => {
  if (value) localStorage.setItem(MODEL_KEY, value)
  else localStorage.removeItem(MODEL_KEY)
})

export function useSettings() {
  return { ollamaBaseUrl, selectedModel }
}

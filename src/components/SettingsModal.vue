<script setup lang="ts">
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  open: boolean
  initialUrl: string
}>()

const emit = defineEmits<{
  close: []
  save: [url: string]
}>()

const { t } = useI18n()

const draftBaseUrl = ref(props.initialUrl)

watch(
  () => props.open,
  (isOpen) => {
    if (isOpen) draftBaseUrl.value = props.initialUrl
  },
)

function save(): void {
  emit('save', draftBaseUrl.value.trim() || 'http://localhost:11434')
}
</script>

<template>
  <div
    v-if="open"
    class="fixed inset-0 z-10 flex items-center justify-center p-4"
    style="background: rgba(20,18,14,0.6); backdrop-filter: blur(4px)"
    @click.self="$emit('close')"
  >
    <div
      class="w-full max-w-md rounded-sm p-8 shadow-2xl"
      style="background: var(--paper); border: 1px solid var(--hair)"
    >
      <h3 class="mb-5 font-display text-2xl font-normal" style="color: var(--ink)">{{ t('settings') }}</h3>
      <label class="mb-5 block">
        <span class="mb-1.5 block font-mono text-[10px] uppercase tracking-[0.2em]" style="color: var(--muted)">{{ t('ollamaUrlLabel') }}</span>
        <input
          v-model="draftBaseUrl"
          class="w-full rounded-sm border px-3 py-2 font-body text-sm outline-none"
          style="border-color: var(--hair); background: rgba(255,250,238,0.55); color: var(--ink)"
          placeholder="http://localhost:11434"
        />
      </label>
      <div class="flex justify-end gap-3">
        <button
          class="cursor-pointer font-mono text-[11px] uppercase tracking-[0.16em]"
          style="background: transparent; border: 1px solid var(--hair); padding: 10px 16px; color: var(--muted)"
          @click="$emit('close')"
        >
          {{ t('close') }}
        </button>
        <button
          class="cursor-pointer border-none px-5 py-2.5 font-display text-base italic"
          style="background: var(--ink); color: var(--paper)"
          @click="save"
        >
          {{ t('save') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const { modal = true, floatingRole = undefined } = defineProps<{
  modal?: boolean
  floatingRole?: string
}>()

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: () => modal,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined
})
</script>

<template>
  <input ref="trigger" data-testid="reference" @click="open = !open" />
  <div data-testid="outside-wrapper">
    <div data-testid="aria-live" aria-live="polite"></div>
    <button data-testid="btn-1" aria-label="btn-1"></button>
    <button data-testid="btn-2" aria-label="btn-2"></button>
  </div>
  <div v-if="open" ref="popup" :role="floatingRole" data-testid="floating"></div>
</template>

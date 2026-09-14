<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const { disabled: initialDisabled = true, floatingRole = 'dialog' } = defineProps<{
  disabled?: boolean
  floatingRole?: string
}>()

const open = shallowRef(false)
const disabled = shallowRef(initialDisabled)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: true,
  enabled: () => !disabled.value,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined
})
</script>

<template>
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = !open"
  ></button>
  <button data-testid="toggle" aria-label="toggle" @click="disabled = !disabled"></button>
  <div v-if="open" ref="popup" data-testid="floating" :role="floatingRole"></div>
</template>

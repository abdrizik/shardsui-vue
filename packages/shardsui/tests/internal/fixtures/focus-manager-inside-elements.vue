<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const dismissElement = useTemplateRef<HTMLElement>('dismiss')

useFocusManager({
  open,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  insideElements: () => [dismissElement.value]
})
</script>

<template>
  <input ref="trigger" data-testid="reference" @click="open = !open" />
  <div data-testid="outside-wrapper">
    <button data-testid="outside-button" aria-label="outside-button"></button>
  </div>
  <template v-if="open">
    <div ref="popup" data-testid="floating"></div>
    <button ref="dismiss" data-testid="dismiss" aria-label="dismiss"></button>
  </template>
</template>

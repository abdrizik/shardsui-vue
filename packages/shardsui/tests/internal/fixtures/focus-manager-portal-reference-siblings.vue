<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'
import FocusManagerPortal from './focus-manager-portal.vue'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: false,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => () => {
    open.value = false
  },
  getNextFocusableElement: () => null
})
</script>

<template>
  <div data-testid="reference-wrapper">
    <button
      ref="trigger"
      data-testid="reference"
      aria-label="reference"
      @click="open = true"
    ></button>
    <span data-testid="reference-sibling-1"></span>
    <span data-testid="reference-sibling-2"></span>
  </div>
  <FocusManagerPortal v-if="open">
    <div ref="popup" data-testid="floating">
      <span tabindex="0" data-testid="inside"></span>
    </div>
  </FocusManagerPortal>
</template>

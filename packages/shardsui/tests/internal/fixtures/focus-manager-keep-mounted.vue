<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { useFocusManager } from '@/internal/floating/focus-manager'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

const close = () => {
  open.value = false
}

useDismiss({
  open,
  onClose: close,
  popupElement,
  isInsideElement: (target) =>
    !!popupElement.value?.contains(target) || !!triggerElement.value?.contains(target)
})

useFocusManager({
  open,
  modal: false,
  enabled: open,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => close
})
</script>

<template>
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = !open"
  ></button>
  <div ref="popup" data-testid="floating">
    <button data-testid="child" aria-label="child"></button>
  </div>
  <button data-testid="after" aria-label="after"></button>
</template>

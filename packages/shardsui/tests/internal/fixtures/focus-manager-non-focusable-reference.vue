<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'
import { useFocusManager } from '@/internal/floating/focus-manager'
import FocusManagerPortal from './focus-manager-portal.vue'

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
  modal: true,
  enabled: true,
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
  <div ref="trigger" data-testid="non-focusable-reference" @click="open = !open">
    <button data-testid="open-dialog" aria-label="open-dialog"></button>
  </div>
  <FocusManagerPortal v-if="open">
    <div ref="popup">
      <button data-testid="close-dialog" aria-label="close-dialog" @click="close"></button>
    </div>
  </FocusManagerPortal>
</template>

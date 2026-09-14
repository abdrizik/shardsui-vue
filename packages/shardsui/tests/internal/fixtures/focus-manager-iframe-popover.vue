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
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => close
})
</script>

<template>
  <div>
    <a href="#">prev iframe link</a>
    <button ref="trigger" @click="open = !open">Open</button>
    <div v-if="open" ref="popup" data-testid="popover">
      <a href="#">popover link 1</a>
      <a href="#">popover link 2</a>
    </div>
    <a href="#">next iframe link</a>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useDismiss, type DismissReason } from '@/internal/floating/dismiss'
import { useFocusManager } from '@/internal/floating/focus-manager'
import { REASONS } from '@/internal/reasons'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const lastCloseEvent = shallowRef<Event | null>(null)
const lastCloseReason = shallowRef<string | null>(null)

function close(reason: DismissReason | string, event: Event) {
  lastCloseEvent.value = event
  lastCloseReason.value = reason
  open.value = false
}

function toggle(event: MouseEvent) {
  if (open.value) {
    close(REASONS.triggerPress, event)
    return
  }
  lastCloseEvent.value = null
  lastCloseReason.value = null
  open.value = true
}

useDismiss({
  open,
  onClose: close,
  popupElement,
  referenceElement: triggerElement,
  isInsideElement: (target) =>
    !!popupElement.value?.contains(target) || !!triggerElement.value?.contains(target)
})

useFocusManager({
  open,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  openMethod: 'mouse',
  closeEvent: lastCloseEvent,
  closeReason: lastCloseReason
})
</script>

<template>
  <button ref="trigger" data-testid="reference" @click="toggle">reference</button>
  <div v-if="open" ref="popup" role="dialog" data-testid="floating"></div>
</template>

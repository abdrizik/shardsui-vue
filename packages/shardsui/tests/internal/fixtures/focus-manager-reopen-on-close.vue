<script setup lang="ts">
import { shallowRef, useTemplateRef, watchPostEffect } from 'vue'
import { useDismiss, type DismissReason } from '@/internal/floating/dismiss'
import { useFocusManager } from '@/internal/floating/focus-manager'
import { REASONS } from '@/internal/reasons'

const open = shallowRef(false)
const reopenOnClose = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const lastCloseEvent = shallowRef<Event | null>(null)
const lastCloseReason = shallowRef<string | null>(null)

function openPopup() {
  lastCloseEvent.value = null
  lastCloseReason.value = null
  open.value = true
}

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
  openPopup()
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
  enabled: open,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  openMethod: 'mouse',
  closeEvent: lastCloseEvent,
  closeReason: lastCloseReason
})

watchPostEffect(() => {
  if (!open.value && reopenOnClose.value) {
    reopenOnClose.value = false
    open.value = true
  }
})
</script>

<template>
  <span data-testid="open-state">{{ String(open) }}</span>
  <button ref="trigger" data-testid="reference" aria-label="reference" @click="toggle"></button>
  <button
    data-testid="reopen-on-close"
    aria-label="reopen on close"
    @click="reopenOnClose = true"
  ></button>
  <div ref="popup">
    <button data-testid="child" aria-label="child"></button>
  </div>
</template>

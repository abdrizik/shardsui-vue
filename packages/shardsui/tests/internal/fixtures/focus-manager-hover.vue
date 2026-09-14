<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'
import { REASONS } from '@/internal/reasons'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const lastCloseEvent = shallowRef<Event | null>(null)

function close(event: Event) {
  lastCloseEvent.value = event
  open.value = false
}

useFocusManager({
  open,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeEvent: lastCloseEvent,
  closeReason: () => REASONS.triggerHover
})
</script>

<template>
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @mouseenter="open = true"
    @mouseleave="close"
  ></button>
  <div v-if="open" ref="popup" data-testid="floating" tabindex="-1" @mouseleave="close"></div>
  <button>outside</button>
</template>

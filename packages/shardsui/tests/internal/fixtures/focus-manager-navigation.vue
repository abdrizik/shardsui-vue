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

function openSubnavigation() {
  lastCloseEvent.value = null
  lastCloseReason.value = null
  open.value = true
}

function close(reason: DismissReason | string, event: Event) {
  lastCloseEvent.value = event
  lastCloseReason.value = reason
  open.value = false
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
  modal: false,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => false,
  finalFocus: () => undefined,
  openMethod: 'mouse',
  closeEvent: lastCloseEvent,
  closeReason: lastCloseReason
})
</script>

<template>
  <nav>
    <ul>
      <li><a href="#home">Home</a></li>
      <li>
        <a
          ref="trigger"
          href="#product"
          @mouseenter="openSubnavigation"
          @mouseleave="(event) => close(REASONS.triggerHover, event)"
        >
          Product
        </a>
      </li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
  <div
    v-if="open"
    ref="popup"
    data-testid="subnavigation"
    tabindex="-1"
    @mouseleave="(event) => close(REASONS.triggerHover, event)"
  >
    <button type="button" @click="(event) => close(REASONS.closePress, event)">Close</button>
    <ul>
      <li><a href="#link-1">Link 1</a></li>
      <li><a href="#link-2">Link 2</a></li>
      <li><a href="#link-3">Link 3</a></li>
    </ul>
  </div>
</template>

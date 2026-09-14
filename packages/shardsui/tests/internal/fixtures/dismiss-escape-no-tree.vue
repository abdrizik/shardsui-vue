<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useDismiss } from '@/internal/floating/dismiss'

const popoverOpen = shallowRef(true)
const tooltipOpen = shallowRef(false)

const popoverTrigger = useTemplateRef<HTMLElement>('popoverTrigger')
const popoverPopup = useTemplateRef<HTMLElement>('popoverPopup')
const focusButton = useTemplateRef<HTMLElement>('focusButton')
const tooltipPopup = useTemplateRef<HTMLElement>('tooltipPopup')

useDismiss({
  open: popoverOpen,
  onClose: () => {
    popoverOpen.value = false
  },
  popupElement: popoverPopup,
  isInsideElement: (target) =>
    !!(popoverTrigger.value?.contains(target) || popoverPopup.value?.contains(target))
})

useDismiss({
  open: tooltipOpen,
  onClose: () => {
    tooltipOpen.value = false
  },
  popupElement: tooltipPopup,
  referenceElement: focusButton,
  isInsideElement: (target) =>
    !!(focusButton.value?.contains(target) || tooltipPopup.value?.contains(target))
})
</script>

<template>
  <button ref="popoverTrigger">reference</button>
  <div v-if="popoverOpen" ref="popoverPopup" role="dialog" data-testid="popover">
    <button
      ref="focusButton"
      data-testid="focus-button"
      @focus="tooltipOpen = true"
      @blur="tooltipOpen = false"
    >
      focus
    </button>
  </div>
  <div v-if="tooltipOpen" ref="tooltipPopup" role="tooltip" data-testid="tooltip"></div>
</template>

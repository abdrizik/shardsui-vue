<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open: true,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined
})
</script>

<template>
  <button ref="trigger" data-testid="reference" aria-label="reference"></button>
  <div ref="popup" data-testid="floating" tabindex="-1"></div>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const { hasTabbableContent = false } = defineProps<{ hasTabbableContent?: boolean }>()

const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open: true,
  modal: false,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => false,
  finalFocus: () => undefined
})
</script>

<template>
  <button ref="trigger" data-testid="reference" aria-label="reference"></button>
  <div ref="popup" data-testid="floating" role="dialog">
    <button v-if="hasTabbableContent" data-testid="inside" aria-label="inside"></button>
  </div>
</template>

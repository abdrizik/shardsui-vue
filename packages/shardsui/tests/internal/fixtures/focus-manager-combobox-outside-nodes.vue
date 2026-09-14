<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: false,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined
})
</script>

<template>
  <input ref="trigger" role="combobox" data-testid="reference" @focus="open = true" />
  <button data-testid="btn-1" aria-label="btn-1"></button>
  <button data-testid="btn-2" aria-label="btn-2"></button>
  <div v-if="open" ref="popup" role="listbox" data-testid="floating"></div>
</template>

<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

const close = () => {
  open.value = false
}

useFocusManager({
  open,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => false,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => close
})
</script>

<template>
  <input ref="trigger" role="combobox" data-testid="input" @click="open = !open" />
  <div v-if="open" ref="popup" data-testid="floating">
    <button tabindex="-1">one</button>
  </div>
  <button data-testid="after" aria-label="after"></button>
</template>

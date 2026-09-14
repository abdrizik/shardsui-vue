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
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => close
})
</script>

<template>
  <div>
    <input
      ref="trigger"
      role="combobox"
      :aria-expanded="open"
      :aria-controls="open ? 'floating' : undefined"
      data-testid="input"
      @click="open = !open"
    />
    <div v-if="open" id="floating" ref="popup" role="listbox" tabindex="-1">
      <button>one</button>
      <button>two</button>
    </div>
  </div>
</template>

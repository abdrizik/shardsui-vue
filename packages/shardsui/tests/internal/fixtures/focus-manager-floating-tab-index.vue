<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const { initialFocus = undefined, floatingRole = 'dialog' } = defineProps<{
  initialFocus?: boolean
  floatingRole?: string
}>()

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: false,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => initialFocus,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => () => {
    open.value = false
  }
})
</script>

<template>
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = true"
  ></button>
  <div
    v-if="open"
    ref="popup"
    data-testid="floating"
    :role="floatingRole"
    :tabindex="floatingRole === 'listbox' ? -1 : undefined"
  ></div>
</template>

<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const { restoreFocus = true } = defineProps<{ restoreFocus?: boolean }>()

const open = shallowRef(false)
const removed = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const two = useTemplateRef<HTMLButtonElement>('two')

const focusTwo = () => two.value

useFocusManager({
  open,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => focusTwo,
  finalFocus: () => undefined,
  restoreFocus: () => restoreFocus
})
</script>

<template>
  <button @click="removed = true">remove</button>
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = !open"
  ></button>
  <div v-if="open" ref="popup" data-testid="floating">
    <button>one</button>
    <button v-if="!removed" ref="two">two</button>
    <button>three</button>
  </div>
</template>

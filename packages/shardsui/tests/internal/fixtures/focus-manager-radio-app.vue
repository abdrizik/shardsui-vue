<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: true,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => undefined,
  finalFocus: () => undefined
})
</script>

<template>
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = !open"
  ></button>
  <div v-if="open" ref="popup" role="dialog">
    <input type="radio" name="group" data-testid="radio-one" />
    <input type="radio" name="group" checked data-testid="radio-two" />
    <button data-testid="after-radio">after</button>
  </div>
</template>

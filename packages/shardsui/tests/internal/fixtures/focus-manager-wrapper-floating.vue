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
    aria-label="reference"
    aria-haspopup="dialog"
    :aria-expanded="open"
    :aria-controls="open ? 'floating' : undefined"
    @click="open = !open"
  ></button>
  <div v-if="open" ref="popup" data-testid="outer">
    <div id="floating" role="dialog" data-shards-ui-focusable data-testid="inner"></div>
  </div>
</template>

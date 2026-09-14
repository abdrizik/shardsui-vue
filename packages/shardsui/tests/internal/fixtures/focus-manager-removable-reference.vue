<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'
import FocusManagerPortal from './focus-manager-portal.vue'

const { modal = true } = defineProps<{ modal?: boolean }>()

const open = shallowRef(false)
const removed = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')

useFocusManager({
  open,
  modal: () => modal,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => () => {
    open.value = false
  }
})
</script>

<template>
  <button
    v-if="!removed"
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = !open"
  ></button>
  <FocusManagerPortal v-if="open">
    <div ref="popup">
      <button
        data-testid="remove"
        @click="
          () => {
            removed = true
            open = false
          }
        "
      >
        remove
      </button>
    </div>
  </FocusManagerPortal>
  <button data-testid="fallback" aria-label="fallback"></button>
</template>

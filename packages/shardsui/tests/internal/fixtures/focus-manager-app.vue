<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'

type Props = {
  modal?: boolean
  initialFocus?: 'two' | boolean
  finalFocus?: FocusTarget
  closeOnFocusOut?: boolean
}

const {
  modal = true,
  initialFocus = undefined,
  finalFocus = undefined,
  closeOnFocusOut = true
} = defineProps<Props>()

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const two = useTemplateRef<HTMLButtonElement>('two')

const focusTwo = () => two.value

useFocusManager({
  open,
  modal: () => modal,
  enabled: true,
  popupElement,
  triggerElement,
  initialFocus: () => (initialFocus === 'two' ? focusTwo : initialFocus),
  finalFocus: () => finalFocus,
  closeOnFocusOut: () => closeOnFocusOut,
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
    @click="open = !open"
  ></button>
  <div v-if="open" ref="popup" role="dialog" data-testid="floating">
    <button data-testid="one">close</button>
    <button ref="two" data-testid="two">confirm</button>
    <button data-testid="three" @click="open = false">x</button>
    <slot />
  </div>
  <div tabindex="0" data-testid="last">outside</div>
</template>

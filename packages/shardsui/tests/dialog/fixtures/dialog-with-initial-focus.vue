<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'
import { useOpen } from './use-open'

const {
  initialFocus,
  finalFocus,
  open: openProp = undefined
} = defineProps<{ initialFocus?: string; finalFocus?: string; open?: boolean }>()

const open = useOpen(() => openProp)

const secondInputElement = shallowRef<HTMLElement | null>(null)
const altFocusElement = shallowRef<HTMLElement | null>(null)

const resolvedInitialFocus = computed(() =>
  initialFocus === 'second-input'
    ? (secondInputElement.value ?? undefined)
    : initialFocus === 'false'
      ? false
      : undefined
)

const resolvedFinalFocus = computed(() =>
  finalFocus === 'alt-focus'
    ? (altFocusElement.value ?? undefined)
    : finalFocus === 'false'
      ? false
      : undefined
)
</script>

<template>
  <button ref="altFocusElement" data-testid="alt-focus-target">Alt Focus Target</button>

  <Dialog.Root v-model:open="open" :modal="true">
    <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup
        data-testid="popup"
        :initial-focus="resolvedInitialFocus"
        :final-focus="resolvedFinalFocus"
      >
        <input data-testid="first-input" />
        <input ref="secondInputElement" data-testid="second-input" />
        <Dialog.Close data-testid="close">Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const { withFinalFocus = false } = defineProps<{ withFinalFocus?: boolean }>()

const initialElement = shallowRef<HTMLElement | null>(null)
const finalElement = shallowRef<HTMLElement | null>(null)
</script>

<template>
  <div>
    <input ref="initialElement" data-testid="initial-outside" />
    <Dialog.Root>
      <Dialog.Backdrop />
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup
          :initial-focus="() => initialElement"
          :final-focus="withFinalFocus ? () => finalElement : undefined"
        >
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
    <input ref="finalElement" data-testid="final-outside" />
  </div>
</template>

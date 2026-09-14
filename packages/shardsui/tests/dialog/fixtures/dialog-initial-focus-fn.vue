<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import type { FocusTarget } from '@/internal/floating/focus-manager'

const { initialFocus = undefined } = defineProps<{ initialFocus?: FocusTarget }>()
</script>

<template>
  <Dialog.Root :modal="false">
    <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="dialog" :initial-focus="initialFocus">
        <input data-testid="input-1" />
        <input data-testid="input-2" />
        <Dialog.Close data-testid="close">Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

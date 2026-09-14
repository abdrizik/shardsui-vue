<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import type { FocusTarget } from '@/internal/floating/focus-manager'

const { finalFocus = undefined } = defineProps<{ finalFocus?: FocusTarget }>()
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="dialog" :final-focus="finalFocus">
        <Dialog.Close data-testid="close">Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

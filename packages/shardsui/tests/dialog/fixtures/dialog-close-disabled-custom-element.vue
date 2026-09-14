<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { onOpenChange } = defineProps<{ onOpenChange?: (open: boolean) => void }>()
</script>

<template>
  <Dialog.Root @update:open="(next) => onOpenChange?.(next)">
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Close as="span" disabled>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { onOpenChange, closeDisabled = false } = defineProps<{
  onOpenChange?: (open: boolean) => void
  closeDisabled?: boolean
}>()
</script>

<template>
  <Dialog.Root @update:open="(next) => onOpenChange?.(next)">
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Close :disabled="closeDisabled">Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

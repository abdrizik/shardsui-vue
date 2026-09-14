<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { onOpenChange } = defineProps<{ onOpenChange?: (open: boolean) => void }>()
</script>

<template>
  <Dialog.Root @update:open="(next) => onOpenChange?.(next)">
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="dialog-popup">
        <Dialog.Title>Dialog title</Dialog.Title>
        <Dialog.Description>Dialog description</Dialog.Description>
        <Dialog.Root>
          <Dialog.Trigger>Open nested</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup data-testid="nested-dialog-popup">
              <Dialog.Title>Nested dialog title</Dialog.Title>
              <Dialog.Close>Close nested</Dialog.Close>
            </Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

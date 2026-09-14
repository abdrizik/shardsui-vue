<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, onOpenChange } = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <AlertDialog.Root v-model:open="open" @update:open="(next) => onOpenChange?.(next)">
    <AlertDialog.Trigger data-testid="trigger">Open</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Backdrop data-testid="backdrop" />
      <AlertDialog.Popup data-testid="alert-dialog-popup">
        <AlertDialog.Title>Alert Dialog Title</AlertDialog.Title>
        <AlertDialog.Description>Alert Dialog Description</AlertDialog.Description>
        <AlertDialog.Close>Close</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>

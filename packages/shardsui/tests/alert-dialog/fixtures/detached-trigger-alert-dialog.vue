<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()
</script>

<template>
  <AlertDialog.Trigger :handle="handle" data-testid="trigger">Open</AlertDialog.Trigger>

  <AlertDialog.Root :handle="handle">
    <AlertDialog.Portal>
      <AlertDialog.Backdrop data-testid="backdrop" />
      <AlertDialog.Popup data-testid="alert-dialog-popup">
        <AlertDialog.Title>Alert Dialog Title</AlertDialog.Title>
        <AlertDialog.Close>Close</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>

<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
</script>

<template>
  <AlertDialog.Root>
    <AlertDialog.Trigger>Trigger 1</AlertDialog.Trigger>
    <AlertDialog.Trigger>Trigger 2</AlertDialog.Trigger>
    <AlertDialog.Trigger>Trigger 3</AlertDialog.Trigger>

    <AlertDialog.Portal>
      <AlertDialog.Popup>
        <AlertDialog.Title>Alert dialog content</AlertDialog.Title>
        <AlertDialog.Close>Close</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>

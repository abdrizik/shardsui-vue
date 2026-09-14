<script setup lang="ts">
import { Dialog } from '@/components/dialog'
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Trigger 1</Dialog.Trigger>
    <Dialog.Trigger>Trigger 2</Dialog.Trigger>
    <Dialog.Trigger>Trigger 3</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
        Dialog Content
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

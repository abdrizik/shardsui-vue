<script setup lang="ts">
import { Dialog } from '@/components/dialog'
</script>

<template>
  <Dialog.Root open trigger-id="trigger-2">
    <Dialog.Trigger id="trigger-1">Trigger 1</Dialog.Trigger>
    <Dialog.Trigger id="trigger-2">Trigger 2</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>Dialog Content</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

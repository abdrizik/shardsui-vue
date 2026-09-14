<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const handle = Dialog.createHandle()
</script>

<template>
  <Dialog.Trigger :handle="handle">Trigger 1</Dialog.Trigger>
  <Dialog.Trigger :handle="handle">Trigger 2</Dialog.Trigger>
  <Dialog.Root :handle="handle" :modal="false">
    <Dialog.Portal>
      <Dialog.Popup>Dialog Content</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

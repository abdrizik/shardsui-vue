<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { handle } = defineProps<{ handle: Dialog.Handle }>()
</script>

<template>
  <Dialog.Trigger id="trigger" :handle="handle">Trigger</Dialog.Trigger>
  <Dialog.Root :handle="handle" open trigger-id="trigger" :modal="false">
    <Dialog.Portal>
      <Dialog.Popup data-testid="popup">Dialog Content</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

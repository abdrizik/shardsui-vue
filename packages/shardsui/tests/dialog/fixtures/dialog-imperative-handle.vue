<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { handle } = defineProps<{ handle: Dialog.Handle }>()
</script>

<template>
  <Dialog.Trigger :handle="handle" id="trigger-a" data-testid="trigger-a">Trigger A</Dialog.Trigger>

  <Dialog.Root :handle="handle">
    <Dialog.Portal>
      <Dialog.Popup>
        Dialog Content
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

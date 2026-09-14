<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import type { DialogHandle } from '@/components/dialog/handle'

const { handle } = defineProps<{ handle: DialogHandle }>()
</script>

<template>
  <Dialog.Root :handle="handle">
    <Dialog.Portal>
      <Dialog.Popup>Dialog Content</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
  <Dialog.Trigger :handle="handle" id="trigger">Trigger</Dialog.Trigger>
</template>

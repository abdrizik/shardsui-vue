<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { handle, nesting = 3 } = defineProps<{ handle: Dialog.Handle; nesting?: number }>()
</script>

<template>
  <Dialog.Trigger v-if="nesting === 0" :handle="handle">Trigger</Dialog.Trigger>
  <div v-else-if="nesting === 1"><Dialog.Trigger :handle="handle">Trigger</Dialog.Trigger></div>
  <div v-else-if="nesting === 2">
    <div><Dialog.Trigger :handle="handle">Trigger</Dialog.Trigger></div>
  </div>
  <div v-else>
    <div>
      <div><Dialog.Trigger :handle="handle">Trigger</Dialog.Trigger></div>
    </div>
  </div>

  <Dialog.Root :handle="handle">
    <Dialog.Portal>
      <Dialog.Popup>
        Dialog Content
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

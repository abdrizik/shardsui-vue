<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { handle } = defineProps<{ handle: Dialog.Handle<number> }>()
</script>

<template>
  <div>
    <Dialog.Trigger :handle="handle" id="trigger1" :payload="1">Trigger 1</Dialog.Trigger>
    <Dialog.Trigger :handle="handle" id="trigger2" :payload="2">Trigger 2</Dialog.Trigger>
    <Dialog.Root v-slot="{ payload }" :handle="handle">
      <Dialog.Portal>
        <Dialog.Popup data-testid="dialog-popup">
          <span data-testid="content">{{ payload }}</span>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>

<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const handle = Dialog.createHandle()
</script>

<template>
  <div>
    <Dialog.Trigger :handle="handle">Trigger 1</Dialog.Trigger>
    <Dialog.Trigger :handle="handle">Trigger 2</Dialog.Trigger>
    <Dialog.Trigger :handle="handle">Trigger 3</Dialog.Trigger>
    <Dialog.Root :handle="handle">
      <Dialog.Portal>
        <Dialog.Popup>
          Dialog Content
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>

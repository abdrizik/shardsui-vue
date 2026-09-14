<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const payloads = shallowRef([1, 2])
</script>

<template>
  <Dialog.Root v-slot="{ payload }">
    <Dialog.Trigger id="trigger-1" :payload="payloads[0]">Trigger 1</Dialog.Trigger>
    <Dialog.Trigger id="trigger-2" :payload="payloads[1]">Trigger 2</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="dialog-popup">
        <span data-testid="content">{{ payload }}</span>
        <button type="button" @click="payloads = [8, 16]">Update payloads</button>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const showSecondTrigger = shallowRef(false)
</script>

<template>
  <Dialog.Root :modal="false">
    <Dialog.Trigger id="trigger-1">Trigger 1</Dialog.Trigger>
    <Dialog.Trigger v-if="showSecondTrigger" id="trigger-2">Trigger 2</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
        <button type="button" @click="showSecondTrigger = true">Mount trigger 2</button>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

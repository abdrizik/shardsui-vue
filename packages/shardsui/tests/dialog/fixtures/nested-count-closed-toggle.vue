<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const showNested = shallowRef(true)
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Trigger 0</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="popup0">
        <Dialog.Root v-if="showNested">
          <Dialog.Trigger>nested trigger</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup />
          </Dialog.Portal>
        </Dialog.Root>
        <button type="button" @click="showNested = !showNested">toggle</button>
        <Dialog.Close>Close 0</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

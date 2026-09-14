<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const showSecond = shallowRef(false)
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Trigger 0</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="popup0">
        <Dialog.Root>
          <Dialog.Trigger>Trigger 1</Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Popup data-testid="popup1" />
          </Dialog.Portal>
        </Dialog.Root>
        <Dialog.Root v-if="showSecond">
          <Dialog.Portal>
            <Dialog.Popup />
          </Dialog.Portal>
        </Dialog.Root>
        <button type="button" @click="showSecond = true">mount sibling</button>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

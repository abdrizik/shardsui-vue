<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const showNested = shallowRef(true)
</script>

<template>
  <div>
    <button type="button" @click="showNested = !showNested">toggle</button>
    <Dialog.Root>
      <Dialog.Trigger>Trigger 0</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup data-testid="popup0">
          <Dialog.Root v-if="showNested">
            <Dialog.Trigger>Trigger 1</Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Popup data-testid="popup1">
                <Dialog.Close>Close 1</Dialog.Close>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
          <Dialog.Close>Close 0</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const inputElement = shallowRef<HTMLElement | null>(null)
</script>

<template>
  <div>
    <Dialog.Root>
      <Dialog.Backdrop />
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup :final-focus="() => inputElement">
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
    <input ref="inputElement" data-testid="input-to-focus" />
  </div>
</template>

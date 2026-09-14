<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const { keepMounted = false } = defineProps<{ keepMounted?: boolean }>()

const inputElement = shallowRef<HTMLElement | null>(null)

function elementFor(type: string) {
  if (type === 'keyboard') {
    return inputElement.value
  }
  return true
}
</script>

<template>
  <div>
    <Dialog.Root>
      <Dialog.Backdrop />
      <Dialog.Trigger>Open</Dialog.Trigger>
      <Dialog.Portal :keep-mounted="keepMounted">
        <Dialog.Popup :final-focus="elementFor">
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
    <input ref="inputElement" data-testid="final-input" />
  </div>
</template>

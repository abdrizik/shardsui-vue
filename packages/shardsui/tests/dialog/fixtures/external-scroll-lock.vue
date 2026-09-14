<script setup lang="ts">
import { Dialog } from '@/components/dialog'

type Props = {
  lock?: () => () => void
  unlockDelay?: number
}

const { lock, unlockDelay = 200 } = defineProps<Props>()

const open = defineModel<boolean>('open', { default: false })

function openDialog() {
  if (lock) {
    const unlock = lock()
    setTimeout(unlock, unlockDelay)
  }
  open.value = true
}
</script>

<template>
  <button @click="openDialog">Open dialog</button>
  <Dialog.Root v-model:open="open">
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Close>Close dialog</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import type { DialogHandle } from '@/components/dialog/handle'

const { handle, phase = 'outgoing' } = defineProps<{
  handle: DialogHandle
  phase?: 'outgoing' | 'overlap' | 'incoming'
}>()
</script>

<template>
  <Dialog.Root v-if="phase === 'outgoing' || phase === 'overlap'" :handle="handle">
    <Dialog.Portal>
      <Dialog.Popup>Outgoing</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>

  <Dialog.Root v-if="phase === 'overlap' || phase === 'incoming'" :handle="handle">
    <Dialog.Portal>
      <Dialog.Popup>Incoming</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

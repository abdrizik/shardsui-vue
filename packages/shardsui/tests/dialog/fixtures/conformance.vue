<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { useOpen } from './use-open'

const { open: openProp = undefined, popupId } = defineProps<{ open?: boolean; popupId?: string }>()

const open = useOpen(() => openProp)
</script>

<template>
  <Dialog.Root v-model:open="open">
    <Dialog.Trigger data-testid="trigger">Open dialog</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup :id="popupId" data-testid="popup">Dialog</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

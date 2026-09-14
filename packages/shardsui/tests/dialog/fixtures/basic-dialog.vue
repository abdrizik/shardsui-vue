<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { useOpen } from './use-open'

const {
  open: openProp = undefined,
  onOpenChange,
  modal = true,
  disablePointerDismissal = false,
  includeBackdrop = false,
  popupTestId = 'dialog-popup',
  popupId
} = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean | 'trap-focus'
  disablePointerDismissal?: boolean
  includeBackdrop?: boolean
  popupTestId?: string
  popupId?: string
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Dialog.Root
    v-model:open="open"
    :modal="modal"
    :disable-pointer-dismissal="disablePointerDismissal"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop v-if="includeBackdrop" data-testid="backdrop" />
      <Dialog.Popup :id="popupId" :data-testid="popupTestId">
        <Dialog.Title>Dialog title</Dialog.Title>
        <Dialog.Description>Dialog description</Dialog.Description>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

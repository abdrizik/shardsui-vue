<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { useOpen } from './use-open'

const {
  open: openProp = undefined,
  onOpenChange,
  modal = false
} = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean | 'trap-focus'
}>()

const open = useOpen(() => openProp, true)
</script>

<template>
  <div>
    <button data-testid="outside">Outside</button>
    <Dialog.Root v-model:open="open" :modal="modal" @update:open="(next) => onOpenChange?.(next)">
      <Dialog.Portal>
        <Dialog.Popup data-testid="dialog-popup">Dialog</Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>

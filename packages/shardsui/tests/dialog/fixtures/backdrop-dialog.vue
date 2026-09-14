<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { useOpen } from './use-open'

const {
  open: openProp = undefined,
  includeNestedBackdrop = false,
  nestedOpen = true,
  modal = false,
  onOpenChange
} = defineProps<{
  open?: boolean
  includeNestedBackdrop?: boolean
  nestedOpen?: boolean
  modal?: boolean
  onOpenChange?: (open: boolean) => void
}>()

const open = useOpen(() => openProp, true)
</script>

<template>
  <Dialog.Root v-model:open="open" :modal="modal" @update:open="(next) => onOpenChange?.(next)">
    <Dialog.Backdrop data-testid="root-backdrop" />
    <Dialog.Portal>
      <Dialog.Popup>
        Root dialog
        <Dialog.Root v-if="includeNestedBackdrop" :open="nestedOpen">
          <Dialog.Backdrop data-testid="nested-backdrop" />
          <Dialog.Portal>
            <Dialog.Popup>Nested dialog</Dialog.Popup>
          </Dialog.Portal>
        </Dialog.Root>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

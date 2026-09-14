<script setup lang="ts">
import { Popover } from '@/components/popover'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  open: openProp = undefined,
  onOpenChange,
  modal = false,
  includeBackdrop = false,
  includeClose = false,
  popupId
} = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
  modal?: boolean | 'trap-focus'
  includeBackdrop?: boolean
  includeClose?: boolean
  popupId?: string
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Popover.Root v-model:open="open" :modal="modal" @update:open="(next) => onOpenChange?.(next)">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Backdrop v-if="includeBackdrop" data-testid="backdrop" />
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup" :id="popupId">
          <Popover.Close v-if="includeClose">Close</Popover.Close>
          Content
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

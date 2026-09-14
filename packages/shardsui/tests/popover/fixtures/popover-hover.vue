<script setup lang="ts">
import { Popover } from '@/components/popover'

const {
  openOnHover = true,
  delay,
  closeDelay,
  modal = false,
  includeClose = false,
  onOpenChange
} = defineProps<{
  openOnHover?: boolean
  delay?: number
  closeDelay?: number
  modal?: boolean | 'trap-focus'
  includeClose?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Popover.Root :modal="modal" @update:open="(next) => onOpenChange?.(next)">
    <Popover.Trigger
      data-testid="trigger"
      :open-on-hover="openOnHover"
      :delay="delay"
      :close-delay="closeDelay"
    >
      Toggle
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup">
          <Popover.Close v-if="includeClose" data-testid="close">Close</Popover.Close>
          Content
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

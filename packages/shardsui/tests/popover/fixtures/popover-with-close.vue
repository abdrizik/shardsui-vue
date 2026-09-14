<script setup lang="ts">
import { Popover } from '@/components/popover'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  open: openProp = undefined,
  onOpenChange,
  keepMounted = false
} = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
  keepMounted?: boolean
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Popover.Root v-model:open="open" @update:open="(next) => onOpenChange?.(next)">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal :keep-mounted="keepMounted">
      <Popover.Positioner>
        <Popover.Popup data-testid="popup">
          <Popover.Title data-testid="title">Popover title</Popover.Title>
          <Popover.Description data-testid="description">Popover description</Popover.Description>
          Content
          <Popover.Close data-testid="close">Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

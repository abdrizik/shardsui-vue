<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { Align, OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  side = 'bottom',
  align = 'center',
  sideOffset = 0,
  alignOffset = 0
} = defineProps<{
  side?: Side
  align?: Align
  sideOffset?: number | OffsetFunction
  alignOffset?: number | OffsetFunction
}>()
</script>

<template>
  <Popover.Root open>
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner
        data-testid="positioner"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <Popover.Popup data-testid="popover-popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

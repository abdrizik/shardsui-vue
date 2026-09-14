<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { Align, OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  side,
  align,
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
  <Tooltip.Root open>
    <Tooltip.Trigger as="div" style="width: 72px; height: 36px">Trigger</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner
        data-testid="positioner"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <Tooltip.Popup style="width: 52px; height: 24px">Popup</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

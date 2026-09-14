<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { Popover } from '@/components/popover'
import type { TextDirection } from '@/internal/direction-context'
import type { Align, OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  side = 'bottom',
  align = 'center',
  direction = 'ltr',
  sideOffset = 0,
  alignOffset = 0
} = defineProps<{
  side?: Side
  align?: Align
  direction?: TextDirection
  sideOffset?: number | OffsetFunction
  alignOffset?: number | OffsetFunction
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Popover.Root open>
      <Popover.Trigger as="div" data-testid="trigger" style="width: 72px; height: 36px">
        Trigger
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner
          data-testid="positioner"
          :side="side"
          :align="align"
          :side-offset="sideOffset"
          :align-offset="alignOffset"
        >
          <Popover.Popup data-testid="popup" style="width: 52px; height: 24px">Popup</Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </DirectionProvider>
</template>

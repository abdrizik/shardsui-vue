<script setup lang="ts">
import { Select } from '@/components/select'
import type { Align, OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  sideOffset,
  alignOffset,
  side,
  align = 'center'
} = defineProps<{
  sideOffset?: number | OffsetFunction
  alignOffset?: number | OffsetFunction
  side?: Side
  align?: Align
}>()
</script>

<template>
  <Select.Root open>
    <Select.Trigger style="width: 72px; height: 36px">Trigger</Select.Trigger>
    <Select.Portal>
      <Select.Positioner
        data-testid="positioner"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <Select.Popup style="width: 52px; height: 24px">Popup</Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

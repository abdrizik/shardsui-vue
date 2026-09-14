<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { Align, OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  side = undefined,
  align = undefined,
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
  <Menu.Root open>
    <Menu.Trigger as="div" style="width: 72px; height: 36px">Trigger</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner
        data-testid="positioner"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <Menu.Popup style="width: 52px; height: 24px">Popup</Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

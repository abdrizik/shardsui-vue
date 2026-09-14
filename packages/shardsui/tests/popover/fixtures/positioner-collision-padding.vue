<script setup lang="ts">
import { Popover } from '@/components/popover'

const { open = false, collisionPadding = 12 } = defineProps<{
  open?: boolean
  collisionPadding?: number
}>()
</script>

<template>
  <div style="position: fixed; bottom: 8px; left: 16px">
    <Popover.Root :open="open">
      <Popover.Trigger data-testid="trigger" style="width: 72px; height: 36px"
        >Toggle</Popover.Trigger
      >
      <Popover.Portal>
        <Popover.Positioner
          data-testid="positioner"
          side="bottom"
          :side-offset="8"
          :collision-padding="collisionPadding"
          :collision-avoidance="{ fallbackAxisSide: 'none' }"
        >
          <Popover.Popup
            data-testid="popover-popup"
            style="width: 200px; height: 1000px; max-height: var(--available-height)"
          >
            Popup
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>

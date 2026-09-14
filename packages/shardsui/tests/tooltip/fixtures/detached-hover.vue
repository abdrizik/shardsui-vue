<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle<unknown> }>()
</script>

<template>
  <div>
    <Tooltip.Trigger :handle="handle" :delay="0" data-testid="trigger-1">Trigger 1</Tooltip.Trigger>
    <Tooltip.Trigger :handle="handle" :delay="0" data-testid="trigger-2">Trigger 2</Tooltip.Trigger>
    <Tooltip.Trigger :handle="handle" :delay="0" data-testid="trigger-3">Trigger 3</Tooltip.Trigger>

    <Tooltip.Root :handle="handle">
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup data-testid="popup">Tooltip Content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </div>
</template>

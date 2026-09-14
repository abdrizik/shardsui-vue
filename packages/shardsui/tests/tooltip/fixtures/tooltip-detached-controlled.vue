<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle }>()
</script>

<template>
  <Tooltip.Trigger :handle="handle" id="trigger-1" data-testid="trigger-1"
    >Trigger 1</Tooltip.Trigger
  >
  <Tooltip.Trigger :handle="handle" id="trigger-2" data-testid="trigger-2"
    >Trigger 2</Tooltip.Trigger
  >
  <Tooltip.Trigger :handle="handle" id="trigger-3" data-testid="trigger-3"
    >Trigger 3</Tooltip.Trigger
  >

  <Tooltip.Root :handle="handle">
    <Tooltip.Portal>
      <Tooltip.Positioner data-testid="positioner">
        <Tooltip.Popup data-testid="popup">Tooltip Content</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

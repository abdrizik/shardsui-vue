<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle }>()
</script>

<template>
  <Tooltip.Root :handle="handle">
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup>First</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>

  <Tooltip.Root :handle="handle">
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup>Second</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

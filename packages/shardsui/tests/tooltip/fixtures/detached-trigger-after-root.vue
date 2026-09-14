<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle }>()
</script>

<template>
  <div>
    <Tooltip.Root :handle="handle">
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup data-testid="content">Content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
    <Tooltip.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Tooltip.Trigger>
  </div>
</template>

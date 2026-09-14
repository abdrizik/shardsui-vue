<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle<number> }>()
</script>

<template>
  <Tooltip.Trigger :handle="handle" :payload="1" :delay="0" data-testid="trigger-1">
    Trigger 1
  </Tooltip.Trigger>
  <Tooltip.Trigger :handle="handle" :payload="2" :delay="0" disabled data-testid="trigger-2">
    Trigger 2
  </Tooltip.Trigger>

  <Tooltip.Root v-slot="{ payload }" :handle="handle">
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

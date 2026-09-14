<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle<unknown> }>()
</script>

<template>
  <Tooltip.Provider :timeout="400">
    <div style="display: flex; gap: 32px">
      <Tooltip.Trigger :handle="handle" :delay="0" data-testid="trigger-1"
        >Trigger 1</Tooltip.Trigger
      >
      <Tooltip.Trigger :handle="handle" :delay="0" data-testid="trigger-2"
        >Trigger 2</Tooltip.Trigger
      >
      <Tooltip.Trigger :handle="handle" :delay="0" data-testid="trigger-3"
        >Trigger 3</Tooltip.Trigger
      >
    </div>

    <Tooltip.Root :handle="handle">
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup data-testid="popup">Tooltip Content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>

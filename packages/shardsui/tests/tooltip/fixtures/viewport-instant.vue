<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger :delay="0" :close-delay="0" data-testid="trigger">Trigger</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup>
          <Tooltip.Viewport data-testid="viewport">Content</Tooltip.Viewport>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

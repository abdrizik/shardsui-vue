<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger id="custom-button" :delay="0" :close-delay="0" data-testid="trigger">
      Trigger
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup data-testid="popup">Content</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

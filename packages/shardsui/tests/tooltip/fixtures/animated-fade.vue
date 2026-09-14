<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const css = `
  .fade-popup {
    transition: opacity 200ms;
    opacity: 1;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>
  <Tooltip.Root>
    <Tooltip.Trigger :delay="0" data-testid="trigger">Trigger</Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup class="fade-popup" data-testid="popup">Tooltip</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

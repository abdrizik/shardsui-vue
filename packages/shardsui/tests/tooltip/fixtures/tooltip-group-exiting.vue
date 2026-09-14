<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const css = `
  .exiting-tooltip[data-ending-style] {
    transition: opacity 10s;
    opacity: 0;
  }
  .exiting-tooltip[data-instant] {
    transition: none;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>
  <Tooltip.Provider :timeout="30000">
    <Tooltip.Root>
      <Tooltip.Trigger :delay="0" data-testid="trigger-1">First</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup class="exiting-tooltip" data-testid="popup-1">First tooltip</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>

    <Tooltip.Root>
      <Tooltip.Trigger :delay="0" data-testid="trigger-2">Second</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup class="exiting-tooltip" data-testid="popup-2"
            >Second tooltip</Tooltip.Popup
          >
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>

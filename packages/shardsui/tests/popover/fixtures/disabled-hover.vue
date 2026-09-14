<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root>
    <Popover.Trigger data-testid="trigger" disabled open-on-hover :delay="0"
      >Toggle</Popover.Trigger
    >
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

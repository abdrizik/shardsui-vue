<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root :modal="false">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">
          <Popover.Close data-testid="close">Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

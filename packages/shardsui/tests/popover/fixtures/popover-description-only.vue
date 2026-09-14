<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root open>
    <Popover.Trigger data-testid="trigger">Trigger</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">
          <Popover.Description>Title</Popover.Description>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

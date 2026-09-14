<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root open>
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup">
          <button type="button" data-testid="inside">Inside</button>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
  <button type="button" data-testid="outside">Outside</button>
</template>

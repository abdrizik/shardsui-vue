<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <div>
    <input data-testid="before" />
    <Popover.Root>
      <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
      <input data-testid="after" />
      <Popover.Portal keep-mounted>
        <Popover.Positioner>
          <Popover.Popup data-testid="popover-popup">
            <button type="button" data-testid="inside">Inside</button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>

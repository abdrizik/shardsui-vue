<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <div>
    <input type="text" data-testid="first-input" />
    <Popover.Root>
      <Popover.Trigger data-testid="trigger" open-on-hover :delay="0" :close-delay="0">
        Toggle
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner data-testid="positioner">
          <Popover.Popup data-testid="popover-popup" class="port-hover-popup" />
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <input type="text" data-testid="last-input" />
  </div>
</template>

<style>
.port-hover-popup {
  width: 100px;
  height: 100px;
  opacity: 1;
  transition: opacity 1ms;
}
.port-hover-popup[data-exiting] {
  opacity: 0;
}
</style>

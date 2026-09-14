<script setup lang="ts">
import { Select } from '@/components/select'
</script>

<template>
  <Select.Root modal>
    <Select.Trigger>Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup class="select-touch-reopen-indicator">
          <Select.Item value="1">Item</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

<style>
@keyframes select-touch-reopen-exit {
  to {
    opacity: 0;
  }
}

.select-touch-reopen-indicator[data-ending-style] {
  animation: select-touch-reopen-exit 20ms linear;
}
</style>

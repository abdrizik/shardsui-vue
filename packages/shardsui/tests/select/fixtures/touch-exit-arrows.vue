<script setup lang="ts">
import { Select } from '@/components/select'

const labels = Array.from({ length: 20 }, (_, i) => `Item ${i}`)
</script>

<template>
  <Select.Root>
    <Select.Trigger data-testid="trigger">Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup class="select-popup-exit-test">
          <Select.ScrollUpArrow keep-mounted data-testid="up-arrow" />
          <Select.List data-testid="list" style="max-height: 40px; overflow: auto">
            <Select.Item v-for="(label, i) in labels" :key="i" :value="label" style="height: 20px">
              {{ label }}
            </Select.Item>
          </Select.List>
          <Select.ScrollDownArrow keep-mounted data-testid="down-arrow" />
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

<style>
@keyframes select-popup-close-test {
  to {
    opacity: 0;
  }
}

.select-popup-exit-test[data-ending-style] {
  animation: select-popup-close-test 200ms linear;
}
</style>

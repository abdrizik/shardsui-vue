<script setup lang="ts">
import { Select } from '@/components/select'

const { onOpenChangeComplete } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <button type="button" data-testid="open-external" @click="open = true">Open</button>
  <button type="button" data-testid="close-external" @click="open = false">Close</button>

  <Select.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Select.Trigger data-testid="trigger">
      <Select.Value placeholder="Pick one" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup data-testid="popup" class="select-animation-test-indicator">
          <Select.Item value="a">Option A</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

<style>
@keyframes select-complete-enter {
  from {
    opacity: 0;
  }
}

@keyframes select-complete-exit {
  to {
    opacity: 0;
  }
}

.select-animation-test-indicator[data-starting-style] {
  animation: select-complete-enter 1ms;
}

.select-animation-test-indicator[data-ending-style] {
  animation: select-complete-exit 1ms;
}
</style>

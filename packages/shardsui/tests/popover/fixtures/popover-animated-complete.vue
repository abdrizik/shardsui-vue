<script setup lang="ts">
import { Popover } from '@/components/popover'

const { onOpenChangeComplete } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <button type="button" data-testid="open-external" @click="open = true">Open</button>
  <button type="button" data-testid="close-external" @click="open = false">Close</button>

  <Popover.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup" class="animation-test-indicator"></Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

<style>
@keyframes popover-complete-enter {
  from {
    opacity: 0;
  }
}

@keyframes popover-complete-exit {
  to {
    opacity: 0;
  }
}

.animation-test-indicator[data-starting-style] {
  animation: popover-complete-enter 1ms;
}

.animation-test-indicator[data-ending-style] {
  animation: popover-complete-exit 1ms;
}
</style>

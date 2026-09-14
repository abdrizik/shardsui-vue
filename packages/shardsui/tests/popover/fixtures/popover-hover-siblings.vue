<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root v-slot="{ payload }">
    <Popover.Trigger
      data-testid="trigger-1"
      payload="One"
      open-on-hover
      :delay="0"
      :close-delay="0"
      style="pointer-events: none"
    >
      One
    </Popover.Trigger>
    <Popover.Trigger
      data-testid="trigger-2"
      payload="Two"
      open-on-hover
      :delay="0"
      :close-delay="0"
      style="pointer-events: none"
    >
      Two
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <span data-testid="content">{{ payload }}</span>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

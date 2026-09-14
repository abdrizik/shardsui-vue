<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <Popover.Root v-slot="{ payload }">
    <Popover.Trigger :payload="1" data-testid="trigger-1">Trigger 1</Popover.Trigger>
    <Popover.Trigger :payload="2" data-testid="trigger-2">Trigger 2</Popover.Trigger>

    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

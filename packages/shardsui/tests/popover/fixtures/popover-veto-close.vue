<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const open = shallowRef(false)
</script>

<template>
  <Popover.Root
    :open="open"
    @update:open="
      (next) => {
        if (next) open = true
      }
    "
  >
    <Popover.Trigger data-testid="trigger" id="trigger-1">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">
          Content
          <Popover.Close data-testid="close" id="close-button">Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

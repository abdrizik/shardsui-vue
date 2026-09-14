<script setup lang="ts">
import { Popover } from '@/components/popover'

const { open = true } = defineProps<{ open?: boolean }>()
</script>

<template>
  <Popover.Root :open="open">
    <Popover.Trigger>Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <Popover.Title>Popover title</Popover.Title>
          <Popover.Description>Popover description</Popover.Description>
          <Popover.Close>Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

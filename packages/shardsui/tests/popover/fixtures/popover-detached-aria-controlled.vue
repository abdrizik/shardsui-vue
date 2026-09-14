<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle }>()
</script>

<template>
  <Popover.Trigger :handle="handle" id="trigger-1" data-testid="trigger-1"
    >Trigger 1</Popover.Trigger
  >
  <Popover.Trigger :handle="handle" id="trigger-2" data-testid="trigger-2"
    >Trigger 2</Popover.Trigger
  >

  <Popover.Root :handle="handle" open trigger-id="trigger-2">
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

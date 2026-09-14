<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle }>()
</script>

<template>
  <Popover.Root :handle="handle">
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">Popover Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>

  <Popover.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Popover.Trigger>
</template>

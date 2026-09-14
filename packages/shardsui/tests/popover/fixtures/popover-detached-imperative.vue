<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle }>()
</script>

<template>
  <Popover.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Popover.Trigger>

  <Popover.Root :handle="handle">
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

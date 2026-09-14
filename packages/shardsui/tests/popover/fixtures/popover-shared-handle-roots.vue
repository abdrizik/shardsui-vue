<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle }>()
</script>

<template>
  <Popover.Root :handle="handle">
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>First</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>

  <Popover.Root :handle="handle">
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>Second</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle, nesting = 0 } = defineProps<{ handle: PopoverHandle; nesting?: 0 | 1 | 2 | 3 }>()
</script>

<template>
  <Popover.Trigger v-if="nesting === 0" :handle="handle" id="trigger" data-testid="trigger">
    Trigger
  </Popover.Trigger>
  <div v-else-if="nesting === 1">
    <Popover.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Popover.Trigger>
  </div>
  <div v-else-if="nesting === 2">
    <div>
      <Popover.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Popover.Trigger>
    </div>
  </div>
  <div v-else>
    <div>
      <div>
        <Popover.Trigger :handle="handle" id="trigger" data-testid="trigger"
          >Trigger</Popover.Trigger
        >
      </div>
    </div>
  </div>

  <Popover.Root :handle="handle">
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">
          Popover Content
          <Popover.Close data-testid="close">Close</Popover.Close>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

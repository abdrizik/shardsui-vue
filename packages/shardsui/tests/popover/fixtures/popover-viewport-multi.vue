<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle } = defineProps<{ handle: PopoverHandle<string> }>()
</script>

<template>
  <Popover.Trigger :handle="handle" id="trigger-1" payload="first" data-testid="trigger1">
    Trigger 1
  </Popover.Trigger>
  <Popover.Trigger :handle="handle" id="trigger-2" payload="second" data-testid="trigger2">
    Trigger 2
  </Popover.Trigger>

  <Popover.Root v-slot="{ payload }" :handle="handle">
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popup">
          <Popover.Viewport>
            <div v-if="payload === 'first'" data-testid="payload-1">Preview 1</div>
            <div v-if="payload === 'second'" data-testid="payload-2">Preview 2</div>
          </Popover.Viewport>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

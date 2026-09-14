<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle, triggerId } = defineProps<{
  handle: PopoverHandle<number>
  triggerId?: string | null
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Popover.Trigger :handle="handle" id="trigger-1" :payload="1" data-testid="trigger-1">
    Trigger 1
  </Popover.Trigger>
  <Popover.Trigger :handle="handle" id="trigger-2" :payload="2" data-testid="trigger-2">
    Trigger 2
  </Popover.Trigger>

  <Popover.Root v-slot="{ payload }" v-model:open="open" :handle="handle" :trigger-id="triggerId">
    <Popover.Portal>
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

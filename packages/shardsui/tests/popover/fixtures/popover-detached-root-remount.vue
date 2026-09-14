<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'

const { handle, rootMounted = true } = defineProps<{
  handle: PopoverHandle<number>
  rootMounted?: boolean
}>()
</script>

<template>
  <Popover.Trigger :handle="handle" id="trigger" :payload="1" data-testid="trigger"
    >Trigger</Popover.Trigger
  >

  <Popover.Root v-if="rootMounted" v-slot="{ payload }" :handle="handle">
    <span data-testid="payload">{{ payload ?? 'No payload' }}</span>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popup">Popover Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

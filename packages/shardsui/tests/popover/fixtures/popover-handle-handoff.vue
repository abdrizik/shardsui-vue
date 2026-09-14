<script setup lang="ts">
import { Popover } from '@/components/popover'
import type { PopoverHandle } from '@/components/popover/handle'
import OpenOnMount from './open-on-mount.vue'

const { handle, phase = 'outgoing' } = defineProps<{
  handle: PopoverHandle
  phase?: 'outgoing' | 'overlap' | 'incoming'
}>()
</script>

<template>
  <Popover.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Popover.Trigger>

  <Popover.Root v-if="phase === 'outgoing' || phase === 'overlap'" key="outgoing" :handle="handle">
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="outgoing">Outgoing</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
  <template v-if="phase === 'overlap' || phase === 'incoming'">
    <Popover.Root key="incoming" :handle="handle">
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup data-testid="incoming">Incoming</Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <OpenOnMount :handle="handle" />
  </template>
</template>

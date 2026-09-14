<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'
import TooltipOpenOnMount from './tooltip-open-on-mount.vue'

const {
  handle,
  phase = 'outgoing',
  onOpenError
} = defineProps<{
  handle: TooltipHandle
  phase?: 'outgoing' | 'overlap' | 'incoming'
  onOpenError?: (error: unknown) => void
}>()
</script>

<template>
  <Tooltip.Trigger :handle="handle" id="trigger" data-testid="trigger">Trigger</Tooltip.Trigger>

  <Tooltip.Root v-if="phase === 'outgoing' || phase === 'overlap'" key="outgoing" :handle="handle">
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup>Outgoing</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>

  <template v-if="phase === 'overlap' || phase === 'incoming'">
    <Tooltip.Root key="incoming" :handle="handle">
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup>Incoming</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
    <TooltipOpenOnMount :handle="handle" trigger-id="trigger" :on-error="onOpenError" />
  </template>
</template>

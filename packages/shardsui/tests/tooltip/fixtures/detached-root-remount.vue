<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle, rootMounted = true } = defineProps<{
  handle: TooltipHandle<number>
  rootMounted?: boolean
}>()
</script>

<template>
  <Tooltip.Trigger :handle="handle" id="trigger" :payload="1" :delay="0" data-testid="trigger">
    Trigger
  </Tooltip.Trigger>

  <Tooltip.Root v-if="rootMounted" v-slot="{ payload }" :handle="handle">
    <span data-testid="payload">{{ payload ?? 'No payload' }}</span>
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup data-testid="popup">Tooltip Content</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

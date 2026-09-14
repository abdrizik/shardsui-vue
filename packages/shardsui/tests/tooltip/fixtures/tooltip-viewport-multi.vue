<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle<string> }>()
</script>

<template>
  <Tooltip.Trigger :handle="handle" id="trigger-1" payload="first" data-testid="trigger1">
    Trigger 1
  </Tooltip.Trigger>
  <Tooltip.Trigger :handle="handle" id="trigger-2" payload="second" data-testid="trigger2">
    Trigger 2
  </Tooltip.Trigger>

  <Tooltip.Root v-slot="{ payload }" :handle="handle">
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup data-testid="popup">
          <Tooltip.Viewport>
            <div v-if="payload === 'first'" data-testid="payload-1">Preview 1</div>
            <div v-if="payload === 'second'" data-testid="payload-2">Preview 2</div>
          </Tooltip.Viewport>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

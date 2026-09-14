<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle, triggerId } = defineProps<{
  handle: TooltipHandle<number>
  triggerId?: string | null
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <div style="margin: 50px">
    <Tooltip.Trigger :handle="handle" id="trigger-1" :payload="1" data-testid="trigger-1">
      Trigger 1
    </Tooltip.Trigger>
    <Tooltip.Trigger :handle="handle" id="trigger-2" :payload="2" data-testid="trigger-2">
      Trigger 2
    </Tooltip.Trigger>

    <Tooltip.Root v-slot="{ payload }" v-model:open="open" :handle="handle" :trigger-id="triggerId">
      <Tooltip.Portal>
        <Tooltip.Positioner data-testid="positioner" side="bottom" align="start">
          <Tooltip.Popup data-testid="popup">
            <span data-testid="content">{{ payload }}</span>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </div>
</template>

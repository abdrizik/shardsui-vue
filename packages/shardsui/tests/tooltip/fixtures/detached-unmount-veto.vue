<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tooltip } from '@/components/tooltip'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle } = defineProps<{ handle: TooltipHandle<number> }>()

const open = shallowRef(true)
const showFirstTrigger = shallowRef(true)
</script>

<template>
  <button data-testid="remove-first" @click="showFirstTrigger = false">remove</button>

  <div>
    <Tooltip.Trigger
      v-if="showFirstTrigger"
      :handle="handle"
      id="trigger-1"
      :payload="1"
      :delay="0"
      data-testid="trigger-1"
    >
      Trigger 1
    </Tooltip.Trigger>
    <Tooltip.Trigger
      :handle="handle"
      id="trigger-2"
      :payload="2"
      :delay="0"
      data-testid="trigger-2"
    >
      Trigger 2
    </Tooltip.Trigger>
  </div>

  <Tooltip.Root
    v-slot="{ payload }"
    :handle="handle"
    :open="open"
    trigger-id="trigger-1"
    @update:open="
      (next) => {
        if (next) open = true
      }
    "
  >
    <Tooltip.Portal>
      <Tooltip.Positioner side="bottom" align="start">
        <Tooltip.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

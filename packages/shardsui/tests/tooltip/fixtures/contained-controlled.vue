<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tooltip } from '@/components/tooltip'

const open = shallowRef(false)
const activeTrigger = shallowRef<string | null>(null)
</script>

<template>
  <div>
    <Tooltip.Root
      v-slot="{ payload }"
      :open="open"
      :trigger-id="activeTrigger"
      @update:open="(next) => (open = next)"
    >
      <Tooltip.Trigger :payload="1" id="trigger-1" :delay="0" data-testid="trigger-1">
        Trigger 1
      </Tooltip.Trigger>
      <Tooltip.Trigger :payload="2" id="trigger-2" :delay="0" data-testid="trigger-2">
        Trigger 2
      </Tooltip.Trigger>

      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup>
            <span data-testid="content">{{ payload }}</span>
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>

    <button
      data-testid="open-1"
      @click="
        () => {
          open = true
          activeTrigger = 'trigger-1'
        }
      "
    >
      Open Trigger 1
    </button>
    <button
      data-testid="open-2"
      @click="
        () => {
          open = true
          activeTrigger = 'trigger-2'
        }
      "
    >
      Open Trigger 2
    </button>
    <button data-testid="close" @click="open = false">Close</button>
  </div>
</template>

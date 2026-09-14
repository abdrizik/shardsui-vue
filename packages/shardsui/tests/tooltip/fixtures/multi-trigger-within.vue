<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tooltip } from '@/components/tooltip'

const { triggerId = 'trigger-1', onOpenChange } = defineProps<{
  triggerId?: string
  onOpenChange?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: true })

const showFirstTrigger = shallowRef(true)
</script>

<template>
  <button data-testid="remove-first" @click="showFirstTrigger = false">remove</button>

  <Tooltip.Root
    v-slot="{ payload }"
    v-model:open="open"
    :trigger-id="triggerId"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <div>
      <Tooltip.Trigger
        v-if="showFirstTrigger"
        id="trigger-1"
        :payload="1"
        :delay="0"
        data-testid="trigger-1"
      >
        Trigger 1
      </Tooltip.Trigger>
      <Tooltip.Trigger id="trigger-2" :payload="2" :delay="0" data-testid="trigger-2">
        Trigger 2
      </Tooltip.Trigger>
    </div>

    <Tooltip.Portal>
      <Tooltip.Positioner side="bottom" align="start" data-testid="positioner">
        <Tooltip.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

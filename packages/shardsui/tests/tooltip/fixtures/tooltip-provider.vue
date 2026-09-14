<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const {
  providerDelay = 600,
  providerCloseDelay = 0,
  triggerDelay
} = defineProps<{
  providerDelay?: number
  providerCloseDelay?: number
  triggerDelay?: number
}>()
</script>

<template>
  <Tooltip.Provider :delay="providerDelay" :close-delay="providerCloseDelay">
    <Tooltip.Root>
      <Tooltip.Trigger data-testid="trigger" :delay="triggerDelay">Toggle</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup data-testid="popup">Content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>

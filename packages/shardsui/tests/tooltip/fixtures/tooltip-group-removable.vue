<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const {
  delay = 0,
  closeDelay = 0,
  timeout = 400,
  showFirst = true
} = defineProps<{ delay?: number; closeDelay?: number; timeout?: number; showFirst?: boolean }>()
</script>

<template>
  <Tooltip.Provider :delay="delay" :close-delay="closeDelay" :timeout="timeout">
    <Tooltip.Root v-if="showFirst">
      <Tooltip.Trigger data-testid="trigger-1">One</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup data-testid="popup-1">First</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>

    <Tooltip.Root>
      <Tooltip.Trigger data-testid="trigger-2">Two</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner>
          <Tooltip.Popup data-testid="popup-2">Second</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>

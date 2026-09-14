<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const {
  triggerDisabled = undefined,
  open = false,
  trackCursorAxis = 'none'
} = defineProps<{
  triggerDisabled?: boolean
  open?: boolean
  trackCursorAxis?: 'none' | 'x' | 'y' | 'both'
}>()

const disabled = defineModel<boolean>('disabled', { default: false })
</script>

<template>
  <button data-testid="disable" @click="disabled = true">Disable</button>

  <Tooltip.Provider :delay="0">
    <Tooltip.Root :open="open" :disabled="disabled" :track-cursor-axis="trackCursorAxis">
      <Tooltip.Trigger data-testid="trigger" :delay="0" :disabled="triggerDisabled">
        Toggle
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner data-testid="positioner">
          <Tooltip.Popup data-testid="popup">Content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>

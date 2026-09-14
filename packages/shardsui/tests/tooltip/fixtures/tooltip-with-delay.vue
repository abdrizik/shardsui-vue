<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const {
  delay = 200,
  closeDelay = 0,
  closeOnClick = true,
  onOpenChange
} = defineProps<{
  delay?: number
  closeDelay?: number
  closeOnClick?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Tooltip.Provider>
    <Tooltip.Root @update:open="(next) => onOpenChange?.(next)">
      <Tooltip.Trigger
        data-testid="trigger"
        :delay="delay"
        :close-delay="closeDelay"
        :close-on-click="closeOnClick"
      >
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

<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const {
  delay = 0,
  onOpenChange,
  disableHoverablePopup = false
} = defineProps<{
  delay?: number
  onOpenChange?: (open: boolean) => void
  disableHoverablePopup?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Tooltip.Provider :delay="delay">
    <Tooltip.Root
      v-model:open="open"
      :disable-hoverable-popup="disableHoverablePopup"
      @update:open="(next) => onOpenChange?.(next)"
    >
      <Tooltip.Trigger data-testid="trigger">Hover me</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner data-testid="positioner">
          <Tooltip.Popup data-testid="popup">Tooltip content</Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
</template>

<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const {
  onOpenChange,
  delay = 0,
  closeDelay = 0
} = defineProps<{
  onOpenChange?: (open: boolean) => void
  delay?: number
  closeDelay?: number
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <PreviewCard.Root v-model:open="open" @update:open="(next) => onOpenChange?.(next)">
    <PreviewCard.Trigger href="#" :delay="delay" :close-delay="closeDelay" data-testid="trigger">
      Hover me
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-testid="positioner">
        <PreviewCard.Popup data-testid="popup">Card content</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

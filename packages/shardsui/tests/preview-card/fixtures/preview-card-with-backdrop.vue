<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const {
  open = false,
  delay = 0,
  closeDelay = 0
} = defineProps<{ open?: boolean; delay?: number; closeDelay?: number }>()
</script>

<template>
  <PreviewCard.Root :open="open">
    <PreviewCard.Trigger :delay="delay" :close-delay="closeDelay" data-testid="trigger">
      Hover me
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Backdrop data-testid="backdrop" />
      <PreviewCard.Positioner data-testid="positioner">
        <PreviewCard.Popup data-testid="popup">Card content</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

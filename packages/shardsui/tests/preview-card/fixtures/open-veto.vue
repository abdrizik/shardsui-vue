<script setup lang="ts">
import { shallowRef } from 'vue'
import { PreviewCard } from '@/components/preview-card'

const open = shallowRef(false)
</script>

<template>
  <PreviewCard.Root
    :open="open"
    @update:open="
      (next) => {
        if (!next) open = false
      }
    "
  >
    <PreviewCard.Trigger href="#" :delay="0" :close-delay="0" data-testid="trigger">
      Hover me
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-testid="positioner">
        <PreviewCard.Popup data-testid="popup">Card content</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

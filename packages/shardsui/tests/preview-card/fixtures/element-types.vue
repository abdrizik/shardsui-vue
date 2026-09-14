<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const { triggerAs, backdropAs, positionerAs, popupAs, viewportAs, arrowAs } = defineProps<{
  triggerAs?: keyof HTMLElementTagNameMap
  backdropAs?: keyof HTMLElementTagNameMap
  positionerAs?: keyof HTMLElementTagNameMap
  popupAs?: keyof HTMLElementTagNameMap
  viewportAs?: keyof HTMLElementTagNameMap
  arrowAs?: keyof HTMLElementTagNameMap
}>()
</script>

<template>
  <PreviewCard.Root open>
    <PreviewCard.Trigger :as="triggerAs" data-testid="trigger">Link</PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Backdrop :as="backdropAs" data-testid="backdrop" />
      <PreviewCard.Positioner :as="positionerAs" data-testid="positioner">
        <PreviewCard.Popup :as="popupAs" data-testid="popup">
          <PreviewCard.Viewport :as="viewportAs" data-testid="viewport"
            >Content</PreviewCard.Viewport
          >
          <PreviewCard.Arrow :as="arrowAs" data-testid="arrow" />
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

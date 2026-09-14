<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
</script>

<template>
  <PreviewCard.Root v-slot="{ payload }">
    <button type="button" aria-label="Initial focus"></button>
    <PreviewCard.Trigger href="#" payload="first" :delay="0" data-testid="trigger1">
      Trigger 1
    </PreviewCard.Trigger>
    <PreviewCard.Trigger href="#" payload="second" :delay="0" data-testid="trigger2">
      Trigger 2
    </PreviewCard.Trigger>

    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup data-testid="popup">
          <PreviewCard.Viewport>
            <img
              v-if="payload === 'first'"
              data-testid="payload-image-1"
              src="about:blank"
              alt="Preview 1"
            />
            <img
              v-if="payload === 'second'"
              data-testid="payload-image-2"
              src="about:blank"
              alt="Preview 2"
            />
            <span data-testid="content">{{ payload ?? '' }}</span>
          </PreviewCard.Viewport>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

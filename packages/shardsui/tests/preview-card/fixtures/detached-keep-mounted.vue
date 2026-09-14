<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'

const { handle } = defineProps<{ handle: PreviewCardHandle<number> }>()
</script>

<template>
  <div style="margin: 50px">
    <PreviewCard.Trigger
      :handle="handle"
      href="#"
      id="trigger-1"
      :payload="1"
      :delay="0"
      :close-delay="0"
      data-testid="trigger1"
    >
      Trigger 1
    </PreviewCard.Trigger>
    <PreviewCard.Trigger
      :handle="handle"
      href="#"
      id="trigger-2"
      :payload="2"
      :delay="0"
      :close-delay="0"
      data-testid="trigger2"
    >
      Trigger 2
    </PreviewCard.Trigger>

    <PreviewCard.Root :handle="handle">
      <PreviewCard.Portal keep-mounted>
        <PreviewCard.Positioner data-testid="positioner" side="bottom" align="start">
          <PreviewCard.Popup data-testid="popup">Content</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </div>
</template>

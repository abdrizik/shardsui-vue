<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const { open = undefined } = defineProps<{ open?: boolean }>()
</script>

<template>
  <PreviewCard.Root :open="open">
    <PreviewCard.Trigger href="#">Trigger</PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup>
          <PreviewCard.Viewport>
            <div data-testid="content">Content</div>
          </PreviewCard.Viewport>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

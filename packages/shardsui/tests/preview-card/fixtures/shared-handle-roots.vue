<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'

const { handle } = defineProps<{ handle: PreviewCardHandle }>()
</script>

<template>
  <PreviewCard.Root :handle="handle">
    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup>First</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>

  <PreviewCard.Root :handle="handle">
    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup>Second</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

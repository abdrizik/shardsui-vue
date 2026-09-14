<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, popupId } = defineProps<{ open?: boolean; popupId?: string }>()

const open = useOpen(() => openProp)
</script>

<template>
  <PreviewCard.Root v-model:open="open">
    <PreviewCard.Trigger href="#" :delay="0" :close-delay="0" data-testid="trigger">
      Hover me
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup :id="popupId" data-testid="popup">Card content</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

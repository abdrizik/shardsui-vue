<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { Align, OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  side,
  align,
  sideOffset = 0,
  alignOffset = 0
} = defineProps<{
  side?: Side
  align?: Align
  sideOffset?: number | OffsetFunction
  alignOffset?: number | OffsetFunction
}>()
</script>

<template>
  <PreviewCard.Root open>
    <PreviewCard.Trigger as="div" style="width: 72px; height: 36px">Trigger</PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner
        data-testid="positioner"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <PreviewCard.Popup style="width: 52px; height: 24px">Popup</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>

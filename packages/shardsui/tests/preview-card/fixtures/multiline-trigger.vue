<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { OffsetFunction, Side } from '@/internal/floating/anchor-positioning'

const {
  side = 'bottom',
  sideOffset = 5,
  delay = 0,
  open = undefined,
  tabindex = undefined,
  scrollSpacers = false,
  marginTop = 0,
  popupHeight = 40
} = defineProps<{
  side?: Side
  sideOffset?: number | OffsetFunction
  delay?: number
  open?: boolean
  tabindex?: number
  scrollSpacers?: boolean
  marginTop?: number
  popupHeight?: number
}>()
</script>

<template>
  <div v-if="scrollSpacers" style="height: 1200px"></div>

  <div :style="{ width: '140px', marginTop: `${marginTop}px` }">
    <PreviewCard.Root :open="open">
      <PreviewCard.Trigger
        :delay="delay"
        data-testid="trigger"
        style="display: inline; line-height: 20px"
        :tabindex="tabindex"
      >
        This is a long text that will wrap across multiple lines in the trigger element
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner data-testid="positioner" :side="side" :side-offset="sideOffset">
          <PreviewCard.Popup
            data-testid="popup"
            :style="{ width: '80px', height: `${popupHeight}px` }"
          >
            Preview Content
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </div>

  <div v-if="scrollSpacers" style="height: 1200px"></div>
</template>

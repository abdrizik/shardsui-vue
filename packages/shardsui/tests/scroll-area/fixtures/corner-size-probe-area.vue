<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'
import CornerSizeProbe from './corner-size-probe.vue'
import { SCROLLABLE_CONTENT_SIZE, VIEWPORT_SIZE } from './scroll-metrics'

const { onRead } = defineProps<{ onRead: () => void }>()
</script>

<template>
  <ScrollArea.Root :style="`width: ${VIEWPORT_SIZE}px; height: ${VIEWPORT_SIZE}px;`">
    <ScrollArea.Viewport data-testid="viewport" style="width: 100%; height: 100%">
      <div
        :style="`width: ${SCROLLABLE_CONTENT_SIZE}px; height: ${SCROLLABLE_CONTENT_SIZE}px;`"
      ></div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" style="width: 10px">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Scrollbar orientation="horizontal" style="height: 10px">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <ScrollArea.Corner data-testid="corner" />
    <CornerSizeProbe :on-read="onRead" />
  </ScrollArea.Root>
</template>

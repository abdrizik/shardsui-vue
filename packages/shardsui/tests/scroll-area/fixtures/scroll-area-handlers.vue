<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'

const { onRootPointerMove, onViewportScroll, onScrollbarPointerDown } = defineProps<{
  onRootPointerMove?: (event: PointerEvent) => void
  onViewportScroll?: (event: Event) => void
  onScrollbarPointerDown?: (event: PointerEvent) => void
}>()
</script>

<template>
  <ScrollArea.Root
    data-testid="root"
    style="height: 100px; width: 100px"
    @pointermove="onRootPointerMove"
  >
    <ScrollArea.Viewport
      data-testid="viewport"
      style="height: 100%; max-height: 100%"
      @scroll="onViewportScroll"
    >
      <ScrollArea.Content data-testid="content">
        <div style="height: 500px; width: 500px">Tall content</div>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      orientation="vertical"
      data-testid="scrollbar-vertical"
      keep-mounted
      @pointerdown="onScrollbarPointerDown"
    >
      <ScrollArea.Thumb data-testid="thumb-vertical" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

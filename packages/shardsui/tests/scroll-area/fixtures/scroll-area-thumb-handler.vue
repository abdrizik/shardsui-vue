<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'

const { onThumbPointerDown, onThumbPointerMove } = defineProps<{
  onThumbPointerDown?: (event: PointerEvent) => void
  onThumbPointerMove?: (event: PointerEvent) => void
}>()
</script>

<template>
  <ScrollArea.Root data-testid="root" style="height: 100px; width: 100px">
    <ScrollArea.Viewport data-testid="viewport" style="height: 100%; max-height: 100%">
      <ScrollArea.Content data-testid="content">
        <div style="height: 500px; width: 500px">Tall content</div>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical" data-testid="scrollbar-vertical" keep-mounted>
      <ScrollArea.Thumb
        data-testid="thumb-vertical"
        @pointerdown="onThumbPointerDown"
        @pointermove="onThumbPointerMove"
      />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

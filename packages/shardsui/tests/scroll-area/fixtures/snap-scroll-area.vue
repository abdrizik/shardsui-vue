<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'

const { thumb = true } = defineProps<{ thumb?: boolean }>()
</script>

<template>
  <ScrollArea.Root data-testid="root" style="height: 200px; width: 200px">
    <ScrollArea.Viewport
      data-testid="viewport"
      style="height: 100%; width: 100%; scroll-snap-type: y mandatory"
    >
      <div style="height: 1000px; width: 200px"></div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar
      orientation="vertical"
      data-testid="scrollbar-vertical"
      keep-mounted
      style="width: 10px; height: 200px"
    >
      <ScrollArea.Thumb v-if="thumb" data-testid="thumb" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

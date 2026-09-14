<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'
</script>

<template>
  <ScrollArea.Root data-testid="root" style="width: 400px; height: 200px">
    <ScrollArea.Viewport
      data-testid="viewport"
      style="width: 100%; height: 100%; scroll-snap-type: x mandatory"
    >
      <div style="display: flex">
        <div
          v-for="index in 10"
          :key="index"
          style="flex-shrink: 0; width: 200px; height: 100px; scroll-snap-align: start"
        ></div>
      </div>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="horizontal" data-testid="scrollbar" keep-mounted>
      <ScrollArea.Thumb data-testid="thumb" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

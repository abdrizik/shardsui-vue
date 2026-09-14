<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { ScrollArea } from '@/components/scroll-area'

const { direction = 'ltr' } = defineProps<{ direction?: 'ltr' | 'rtl' }>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <ScrollArea.Root :style="`width: 200px; height: 200px; direction: ${direction};`">
      <ScrollArea.Viewport data-testid="viewport" style="width: 100%; height: 100%">
        <div style="width: 1000px; height: 200px"></div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar
        orientation="horizontal"
        data-testid="scrollbar"
        keep-mounted
        style="display: flex; width: 200px; height: 10px"
      >
        <ScrollArea.Thumb data-testid="thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  </DirectionProvider>
</template>

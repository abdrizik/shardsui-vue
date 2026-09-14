<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { ScrollArea } from '@/components/scroll-area'

const { direction = 'ltr', orientation = 'horizontal' } = defineProps<{
  direction?: 'ltr' | 'rtl'
  orientation?: 'horizontal' | 'vertical'
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <ScrollArea.Root :style="`width: 200px; height: 200px; direction: ${direction};`">
      <ScrollArea.Viewport data-testid="viewport" style="width: 100%; height: 100%">
        <div style="width: 1000px; height: 1000px"></div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar :orientation="orientation" data-testid="scrollbar" keep-mounted />
    </ScrollArea.Root>
  </DirectionProvider>
</template>

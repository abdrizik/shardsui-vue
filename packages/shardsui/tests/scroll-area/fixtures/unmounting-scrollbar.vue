<script setup lang="ts">
import { shallowRef } from 'vue'
import { ScrollArea } from '@/components/scroll-area'

const mounted = shallowRef(true)
</script>

<template>
  <ScrollArea.Root data-testid="root">
    <ScrollArea.Viewport data-testid="viewport"></ScrollArea.Viewport>
    <ScrollArea.Scrollbar v-if="mounted" data-testid="scrollbar" keep-mounted>
      <ScrollArea.Thumb data-testid="thumb" @pointermove="mounted = false" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

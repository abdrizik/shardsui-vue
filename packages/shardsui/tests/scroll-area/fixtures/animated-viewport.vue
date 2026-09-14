<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'

const { mounted = true } = defineProps<{ mounted?: boolean }>()
</script>

<template>
  <ScrollArea.Root data-testid="root">
    <ScrollArea.Viewport v-if="mounted" data-testid="viewport"></ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="horizontal" keep-mounted>
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

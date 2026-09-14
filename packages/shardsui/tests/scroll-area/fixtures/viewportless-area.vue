<script setup lang="ts">
import { ScrollArea } from '@/components/scroll-area'
</script>

<template>
  <ScrollArea.Root data-testid="root">
    <ScrollArea.Scrollbar data-testid="scrollbar" keep-mounted>
      <ScrollArea.Thumb data-testid="thumb" />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

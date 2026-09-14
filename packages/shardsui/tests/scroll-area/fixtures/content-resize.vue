<script setup lang="ts">
import { shallowRef } from 'vue'
import { ScrollArea } from '@/components/scroll-area'

const height = shallowRef(50)
</script>

<template>
  <ScrollArea.Root data-testid="root" style="width: 200px; height: 200px">
    <ScrollArea.Viewport data-testid="viewport" style="width: 100%; height: 100%">
      <ScrollArea.Content data-testid="content">
        <div :style="`width: 50px; height: ${height}px;`"></div>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <button type="button" @click="height = 1000">grow</button>
  </ScrollArea.Root>
</template>

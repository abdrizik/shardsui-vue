<script setup lang="ts">
import { shallowRef } from 'vue'
import { ScrollArea } from '@/components/scroll-area'

const show = shallowRef(false)
</script>

<template>
  <ScrollArea.Root data-testid="root" style="width: 200px; height: 200px">
    <ScrollArea.Viewport data-testid="viewport" style="width: 100%; height: 100%">
      <ScrollArea.Content v-if="show">
        <div style="width: 1000px; height: 1000px"></div>
      </ScrollArea.Content>
    </ScrollArea.Viewport>
    <ScrollArea.Scrollbar orientation="vertical">
      <ScrollArea.Thumb />
    </ScrollArea.Scrollbar>
    <button type="button" @click="show = true">show</button>
  </ScrollArea.Root>
</template>

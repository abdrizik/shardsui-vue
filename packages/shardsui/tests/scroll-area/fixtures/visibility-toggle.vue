<script setup lang="ts">
import { shallowRef } from 'vue'
import { ScrollArea } from '@/components/scroll-area'

const visible = shallowRef(false)
</script>

<template>
  <button type="button" @click="visible = true">show</button>
  <div :style="{ display: visible ? 'block' : 'none' }">
    <ScrollArea.Root style="width: 200px; height: 200px">
      <ScrollArea.Viewport data-testid="viewport" style="width: 100%; height: 100%">
        <div style="width: 1000px; height: 1000px"></div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical" style="display: flex">
        <ScrollArea.Thumb data-testid="vertical-thumb" style="padding-block: 8px" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  </div>
</template>

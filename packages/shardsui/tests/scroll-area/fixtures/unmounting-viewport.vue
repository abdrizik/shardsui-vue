<script setup lang="ts">
import { shallowRef } from 'vue'
import { ScrollArea } from '@/components/scroll-area'

const { on = 'pointerup' } = defineProps<{ on?: 'pointerup' | 'scroll' }>()

const mounted = shallowRef(true)

function unmount() {
  mounted.value = false
}
</script>

<template>
  <ScrollArea.Root data-testid="root">
    <ScrollArea.Viewport
      v-if="mounted"
      data-testid="viewport"
      style="scroll-snap-type: y mandatory"
      @scroll="on === 'scroll' ? unmount() : undefined"
    ></ScrollArea.Viewport>
    <ScrollArea.Scrollbar data-testid="scrollbar" keep-mounted>
      <ScrollArea.Thumb
        data-testid="thumb"
        @pointerup="on === 'pointerup' ? unmount() : undefined"
      />
    </ScrollArea.Scrollbar>
  </ScrollArea.Root>
</template>

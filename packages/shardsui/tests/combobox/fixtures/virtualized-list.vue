<script setup lang="ts">
import { computed } from 'vue'
import { Combobox } from '@/components/combobox'

const {
  items,
  windowStart = 0,
  windowSize = 5
} = defineProps<{
  items: string[]
  windowStart?: number
  windowSize?: number
}>()

const visible = computed(() => {
  const start = Math.min(windowStart, Math.max(0, items.length - windowSize))
  return items.slice(start, start + windowSize).map((item, i) => ({ item, index: start + i }))
})
</script>

<template>
  <Combobox.List data-testid="list">
    <Combobox.Item
      v-for="entry in visible"
      :key="entry.item"
      :index="entry.index"
      :value="entry.item"
      :data-index="entry.index"
    >
      {{ entry.item }}
    </Combobox.Item>
  </Combobox.List>
</template>

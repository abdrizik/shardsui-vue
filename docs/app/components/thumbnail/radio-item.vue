<script setup lang="ts">
import Bar from './bar.vue'

const { checked = false, barWidth = 'w-full' } = defineProps<{
  checked?: boolean
  barWidth?: string
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <div :class="['size-4 shrink-0 rounded-full', checked ? 'bg-gray-900' : 'bg-gray-100']"></div>
    <Bar variant="secondary" :class="barWidth" />
  </div>
</template>

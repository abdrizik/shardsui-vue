<script setup lang="ts">
import { Separator } from '@shardsui/vue/separator'

const stats = [
  { label: 'Projects', value: '6' },
  { label: 'Active days', value: '42' },
  { label: 'Hours', value: '118' }
]
</script>

<template>
  <div class="flex items-center gap-4 text-nowrap">
    <template v-for="(stat, index) in stats" :key="stat.label">
      <Separator v-if="index > 0" orientation="vertical" class="w-px self-stretch bg-gray-300" />

      <dl class="flex flex-col">
        <dt class="text-xs text-gray-500">{{ stat.label }}</dt>
        <dd class="text-lg font-medium text-gray-900">{{ stat.value }}</dd>
      </dl>
    </template>
  </div>
</template>

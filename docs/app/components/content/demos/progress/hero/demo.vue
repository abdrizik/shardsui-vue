<script setup lang="ts">
import { Progress } from '@shardsui/vue/progress'
import { onMounted, onUnmounted, shallowRef } from 'vue'

const value = shallowRef(15)

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    value.value = Math.min(100, Math.round(value.value + Math.random() * 20))
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<template>
  <Progress.Root class="grid w-60 max-w-full grid-cols-2 gap-y-2" :value="value">
    <Progress.Label class="text-sm font-normal text-gray-900">Uploading</Progress.Label>
    <Progress.Value class="text-right text-sm text-gray-900 tabular-nums" />
    <Progress.Track
      class="col-span-full h-1 overflow-hidden rounded-sm bg-gray-50 inset-ring inset-ring-gray-200"
    >
      <Progress.Indicator class="block bg-gray-500 transition-[width] duration-500" />
    </Progress.Track>
  </Progress.Root>
</template>

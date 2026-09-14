<script setup lang="ts">
import Bar from './bar.vue'

const {
  showError = false,
  labelWidth = 'w-16',
  valueWidth = 'w-1/2'
} = defineProps<{
  showError?: boolean
  labelWidth?: string
  valueWidth?: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2">
    <Bar variant="main" :class="labelWidth" />
    <div class="flex w-full max-w-56 flex-col rounded-lg bg-gray-50 ring-1 ring-gray-200/60">
      <div class="flex flex-1 items-center px-3 py-2.5">
        <Bar variant="secondary" :class="valueWidth" />
      </div>
    </div>
    <Bar v-if="showError" variant="secondary" class="w-4/5" />
  </div>
</template>

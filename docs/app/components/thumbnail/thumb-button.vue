<script setup lang="ts">
const { variant = 'secondary' } = defineProps<{ variant?: 'primary' | 'secondary' }>()
</script>

<template>
  <div
    class="h-3 w-7 rounded-sm"
    :class="variant === 'primary' ? 'bg-gray-900' : 'bg-gray-200'"
  ></div>
</template>

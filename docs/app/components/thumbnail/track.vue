<script setup lang="ts">
const { fillWidth } = defineProps<{ fillWidth: string }>()
</script>

<template>
  <div class="h-1.5 w-full rounded-full bg-gray-200">
    <div :class="['h-1.5', fillWidth, 'rounded-s-full bg-gray-900']"></div>
  </div>
</template>

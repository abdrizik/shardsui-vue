<script setup lang="ts">
import ThumbButton from './thumb-button.vue'
</script>

<template>
  <div
    class="flex w-full max-w-56 flex-col gap-5 rounded-lg bg-gray-50 p-3 ring-1 ring-gray-200/60"
  >
    <slot />
    <div class="flex items-center justify-end gap-2 pt-1">
      <ThumbButton variant="secondary" />
      <ThumbButton variant="primary" />
    </div>
  </div>
</template>

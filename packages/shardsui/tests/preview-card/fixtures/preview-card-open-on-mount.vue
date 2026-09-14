<script setup lang="ts">
import { onMounted } from 'vue'
import type { PreviewCardHandle } from '@/components/preview-card/handle'

const { handle, triggerId, onError } = defineProps<{
  handle: PreviewCardHandle
  triggerId: string
  onError?: (error: unknown) => void
}>()

onMounted(() => {
  try {
    handle.open(triggerId)
  } catch (error) {
    onError?.(error)
  }
})
</script>

<template><span hidden></span></template>

<script setup lang="ts">
import { onMounted } from 'vue'
import type { TooltipHandle } from '@/components/tooltip/handle'

const { handle, triggerId, onError } = defineProps<{
  handle: TooltipHandle
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

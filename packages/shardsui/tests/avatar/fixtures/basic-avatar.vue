<script setup lang="ts">
import { Avatar, type ImageLoadingStatus } from '@/components/avatar'

const {
  src,
  fallbackText = 'AB',
  onLoadingStatusChange
} = defineProps<{
  src?: string
  fallbackText?: string
  onLoadingStatusChange?: (status: ImageLoadingStatus) => void
}>()
</script>

<template>
  <Avatar.Root>
    <Avatar.Image
      v-if="src !== undefined"
      :src="src"
      alt=""
      @loading-status-change="onLoadingStatusChange"
    />
    <Avatar.Fallback>{{ fallbackText }}</Avatar.Fallback>
  </Avatar.Root>
</template>

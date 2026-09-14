<script setup lang="ts">
import { Avatar } from '@/components/avatar'

const { src } = defineProps<{ src?: string }>()
</script>

<template>
  <Avatar.Root>
    <Avatar.Image data-testid="image" :src="src" alt="" />
    <Avatar.Fallback data-testid="fallback" class="animation-test-fallback">AC</Avatar.Fallback>
  </Avatar.Root>
</template>

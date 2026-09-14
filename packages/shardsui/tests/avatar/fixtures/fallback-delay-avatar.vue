<script setup lang="ts">
import { Avatar } from '@/components/avatar'

const { delay } = defineProps<{ delay?: number }>()
</script>

<template>
  <Avatar.Root>
    <Avatar.Image />
    <Avatar.Fallback :delay="delay">AC</Avatar.Fallback>
  </Avatar.Root>
</template>

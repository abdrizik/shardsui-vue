<script setup lang="ts">
import { Avatar } from '@/components/avatar'

const { src = 'avatar.png' } = defineProps<{ src?: string }>()
</script>

<template>
  <Avatar.Root>
    <Avatar.Image
      :src="src"
      sizes="48px"
      srcset="avatar.png 1x, avatar@2x.png 2x"
      crossorigin="anonymous"
      referrerpolicy="no-referrer"
    />
  </Avatar.Root>
</template>

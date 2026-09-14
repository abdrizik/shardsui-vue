<script setup lang="ts">
import { Avatar } from '@/components/avatar'

const { showImage = true, ontransitionend } = defineProps<{
  showImage?: boolean
  ontransitionend?: (event: TransitionEvent) => void
}>()
</script>

<template>
  <Avatar.Root>
    <Avatar.Image
      data-testid="image"
      class="animation-test-image"
      :src="showImage ? 'avatar.png' : undefined"
      @transitionend="ontransitionend"
    />
  </Avatar.Root>
</template>

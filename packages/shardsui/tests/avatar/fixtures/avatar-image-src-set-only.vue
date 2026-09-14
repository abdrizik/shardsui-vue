<script setup lang="ts">
import { Avatar } from '@/components/avatar'
</script>

<template>
  <Avatar.Root>
    <Avatar.Image srcset="avatar.png 1x, avatar@2x.png 2x" alt="Avatar" />
    <Avatar.Fallback>FB</Avatar.Fallback>
  </Avatar.Root>
</template>

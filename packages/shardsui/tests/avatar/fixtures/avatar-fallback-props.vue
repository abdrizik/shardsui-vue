<script setup lang="ts">
import { Avatar } from '@/components/avatar'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Avatar.Root>
    <Avatar.Fallback v-bind="$attrs" />
  </Avatar.Root>
</template>

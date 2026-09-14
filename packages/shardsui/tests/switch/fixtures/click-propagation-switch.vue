<script setup lang="ts">
import { Switch } from '@/components/switch'

const {
  as = 'span',
  onClick,
  onParentClick
} = defineProps<{
  as?: 'span' | 'button'
  onClick?: (event: MouseEvent) => void
  onParentClick: (event: MouseEvent) => void
}>()
</script>

<template>
  <div @click="onParentClick">
    <Switch.Root :as="as" :on-click="onClick" />
  </div>
</template>

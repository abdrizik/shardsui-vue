<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

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
    <Checkbox.Root :as="as" :on-click="onClick" data-testid="checkbox" />
  </div>
</template>

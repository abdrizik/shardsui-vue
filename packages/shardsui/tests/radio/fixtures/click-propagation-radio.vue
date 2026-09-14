<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

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
  <RadioGroup>
    <div @click="onParentClick">
      <Radio.Root :as="as" :on-click="onClick" value="a" data-testid="radio" />
    </div>
  </RadioGroup>
</template>

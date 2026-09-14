<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onParentClick } = defineProps<{ onParentClick: (event: MouseEvent) => void }>()
</script>

<template>
  <div @click="onParentClick">
    <RadioGroup value="a">
      <Radio.Root value="a" data-testid="radio-a" />
      <Radio.Root value="b" data-testid="radio-b" />
    </RadioGroup>
  </div>
</template>

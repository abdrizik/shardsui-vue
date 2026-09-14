<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onValueChange } = defineProps<{ onValueChange: (value: unknown) => void }>()
</script>

<template>
  <RadioGroup @update:value="onValueChange">
    <Radio.Root value="a" data-testid="item" />
  </RadioGroup>
</template>

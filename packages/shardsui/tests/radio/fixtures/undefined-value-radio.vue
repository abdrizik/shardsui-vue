<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <RadioGroup>
    <Radio.Root :value="undefined" data-testid="radio-undefined">No value</Radio.Root>
    <Radio.Root value="a" data-testid="radio-a">Option A</Radio.Root>
  </RadioGroup>
</template>

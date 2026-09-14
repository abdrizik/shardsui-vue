<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <RadioGroup>
    <Radio.Root :value="null" data-testid="radio-null">Null option</Radio.Root>
    <Radio.Root value="a" data-testid="radio-a">Option A</Radio.Root>
  </RadioGroup>
</template>

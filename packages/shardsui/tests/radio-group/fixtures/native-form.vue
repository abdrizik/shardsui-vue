<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <form data-testid="form">
    <RadioGroup name="group">
      <Radio.Root value="a" data-testid="radio-a" />
      <Radio.Root value="b" data-testid="radio-b" />
      <Radio.Root value="c" data-testid="radio-c" />
    </RadioGroup>
  </form>
</template>

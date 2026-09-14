<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onSubmit } = defineProps<{ onSubmit: (event: SubmitEvent) => void }>()
</script>

<template>
  <form @submit="onSubmit">
    <RadioGroup name="test-group">
      <Radio.Root value="option-a" />
      <Radio.Root value="option-b" />
    </RadioGroup>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onSubmit } = defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <form id="external-form" @submit="onSubmit">
    <button type="submit">Submit</button>
  </form>
  <RadioGroup name="group" form="external-form" value="b">
    <Radio.Root value="a" />
    <Radio.Root value="b" />
  </RadioGroup>
</template>

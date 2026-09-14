<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { id = 'radio-input' } = defineProps<{ id?: string }>()
</script>

<template>
  <div>
    <label for="radio-input">Label A</label>
    <label for="radio-input-b">Label B</label>
    <RadioGroup>
      <Radio.Root value="a" :id="id" />
    </RadioGroup>
  </div>
</template>

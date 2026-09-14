<script setup lang="ts">
import { shallowRef } from 'vue'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { readOnly = false, cancel = false } = defineProps<{ readOnly?: boolean; cancel?: boolean }>()

const value = shallowRef<unknown>('a')

function setValue(next: unknown) {
  if (!cancel) value.value = next
}
</script>

<template>
  <RadioGroup :value="value" :read-only="readOnly" name="plan" @update:value="setValue">
    <Radio.Root value="a" id="radio-a" data-testid="a">A</Radio.Root>
    <Radio.Root value="b" id="radio-b" data-testid="b">B</Radio.Root>
  </RadioGroup>
  <label for="radio-b" data-testid="label-b">B</label>
</template>

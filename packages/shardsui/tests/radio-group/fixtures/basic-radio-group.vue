<script setup lang="ts">
import { shallowRef } from 'vue'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const {
  value: initialValue,
  onValueChange,
  disabled = false,
  readOnly = false,
  required = false,
  name
} = defineProps<{
  value?: string
  onValueChange?: (value: string | undefined) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
}>()

const value = shallowRef<string | undefined>(initialValue)
</script>

<template>
  <RadioGroup
    v-model:value="value"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :name="name"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Radio.Root value="a" data-testid="radio-a">Option A<Radio.Indicator /></Radio.Root>
    <Radio.Root value="b" data-testid="radio-b">Option B<Radio.Indicator /></Radio.Root>
    <Radio.Root value="c" data-testid="radio-c">Option C<Radio.Indicator /></Radio.Root>
  </RadioGroup>
</template>

<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const {
  name,
  disabled = false,
  validate,
  validationMode
} = defineProps<{
  name?: string
  disabled?: boolean
  validate?: FieldValidator
  validationMode?: FormValidationMode
}>()
</script>

<template>
  <Field.Root
    :name="name"
    :disabled="disabled"
    :validate="validate"
    :validation-mode="validationMode"
  >
    <RadioGroup data-testid="radio-group">
      <Radio.Root value="a" data-testid="radio-a">Option A<Radio.Indicator /></Radio.Root>
      <Radio.Root value="b" data-testid="radio-b">Option B<Radio.Indicator /></Radio.Root>
      <Radio.Root value="c" data-testid="radio-c">Option C<Radio.Indicator /></Radio.Root>
    </RadioGroup>
    <Field.Error data-testid="error">Error</Field.Error>
  </Field.Root>
</template>

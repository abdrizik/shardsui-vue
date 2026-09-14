<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const {
  name = 'test',
  required = false,
  validate,
  onFormSubmit
} = defineProps<{
  name?: string
  required?: boolean
  validate?: FieldValidator
  onFormSubmit?: (values: Record<string, unknown>) => void
}>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root :name="name" :validate="validate" data-testid="field">
      <RadioGroup :required="required" data-testid="group">
        <Radio.Root value="a" data-testid="item-a">A<Radio.Indicator /></Radio.Root>
        <Radio.Root value="b" data-testid="item-b">B<Radio.Indicator /></Radio.Root>
        <Radio.Root value="c" data-testid="item-c">C<Radio.Indicator /></Radio.Root>
      </RadioGroup>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>

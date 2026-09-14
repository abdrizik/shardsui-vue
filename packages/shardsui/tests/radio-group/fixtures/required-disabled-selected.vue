<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit" data-testid="form">
    <Field.Root name="choice">
      <RadioGroup required value="a">
        <Radio.Root value="a" disabled data-testid="item-a" />
        <Radio.Root value="b" data-testid="item-b" />
      </RadioGroup>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

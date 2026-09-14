<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <form id="external-form"></form>
  <Form @form-submit="onFormSubmit" data-testid="form">
    <Field.Root name="choice">
      <RadioGroup form="external-form" value="a">
        <Radio.Root value="a" data-testid="item-a" />
        <Radio.Root value="b" data-testid="item-b" />
      </RadioGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

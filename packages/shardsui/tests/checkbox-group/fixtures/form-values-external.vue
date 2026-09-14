<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <form id="external-form"></form>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="fruits">
      <CheckboxGroup :value="['apple', 'banana']">
        <Checkbox.Root value="apple" />
        <Checkbox.Root value="banana" form="external-form" />
      </CheckboxGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

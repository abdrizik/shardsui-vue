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
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <Checkbox.Root value="external" form="external-form" required />
        <Checkbox.Root value="current" />
      </CheckboxGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

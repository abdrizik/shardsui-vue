<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit, validate } = defineProps<{
  onFormSubmit: (values: Record<string, unknown>) => void
  validate: FieldValidator
}>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root>
      <Field.Control name="email" value="one@example.com" />
    </Field.Root>
    <Field.Root name="confirmEmail" :validate="validate">
      <Field.Control value="one@example.com" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

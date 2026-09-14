<script setup lang="ts">
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

defineProps<{
  errors?: FormErrors
  onFormSubmit?: (values: Record<string, unknown>) => void
}>()
</script>

<template>
  <Form :errors="errors" @form-submit="onFormSubmit">
    <Field.Root name="name">
      <Field.Control data-testid="name" />
      <Field.Error data-testid="name-error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

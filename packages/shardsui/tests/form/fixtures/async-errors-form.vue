<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

const errors = shallowRef<FormErrors | undefined>()

function onFormSubmit() {
  const next: FormErrors = { first: 'First error', second: 'Second error' }
  void Promise.resolve().then(() => {
    errors.value = next
  })
}
</script>

<template>
  <Form :errors="errors" @form-submit="onFormSubmit">
    <Field.Root name="first">
      <Field.Control data-testid="first" />
      <Field.Error data-testid="first-error" />
    </Field.Root>
    <Field.Root name="second">
      <Field.Control data-testid="second" />
      <Field.Error data-testid="second-error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

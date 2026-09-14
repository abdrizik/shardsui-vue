<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

const errors = shallowRef<FormErrors>({})

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget as HTMLFormElement)
  const name = String(formData.get('name') ?? '')
  const age = String(formData.get('age') ?? '')
  errors.value = {
    ...(name === '' && { name: 'Name is required' }),
    ...(age === '' && { age: 'Age is required' })
  }
}
</script>

<template>
  <Form :errors="errors" :on-submit="onSubmit">
    <Field.Root name="name">
      <Field.Control data-testid="name" />
      <Field.Error data-testid="name-error" />
    </Field.Root>
    <Field.Root name="age">
      <Field.Control data-testid="age" />
      <Field.Error data-testid="age-error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

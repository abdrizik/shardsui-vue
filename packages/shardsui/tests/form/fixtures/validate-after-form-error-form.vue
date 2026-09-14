<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

defineProps<{ validate?: FieldValidator }>()

const errors = shallowRef<FormErrors>({})

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget as HTMLFormElement)
  const name = String(formData.get('name') ?? '')
  errors.value = name === 'abcde' ? { name: 'submit error' } : {}
}
</script>

<template>
  <Form :errors="errors" :on-submit="onSubmit">
    <Field.Root name="name" :validate="validate">
      <Field.Control data-testid="name" />
      <Field.Error data-testid="name-error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

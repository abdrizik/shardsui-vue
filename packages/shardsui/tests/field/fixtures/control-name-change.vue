<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
const name = shallowRef<string | undefined>('email')
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root>
      <Field.Control :name="name" value="one@example.com" />
    </Field.Root>
    <button type="button" @click="name = 'alternateEmail'">Change name</button>
    <button type="button" @click="name = undefined">Clear name</button>
    <button type="submit">submit</button>
  </Form>
</template>

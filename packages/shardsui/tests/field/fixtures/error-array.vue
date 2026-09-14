<script setup lang="ts">
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

const { errors } = defineProps<{ errors: FormErrors }>()
</script>

<template>
  <Form :errors="errors">
    <Field.Root name="username">
      <Field.Control value="admin" />
      <Field.Error data-testid="default-error" />
    </Field.Root>
  </Form>
</template>

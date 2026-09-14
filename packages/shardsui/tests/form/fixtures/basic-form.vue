<script setup lang="ts">
import { Field } from '@/components/field'
import { Form, type FormErrors } from '@/components/form'

defineProps<{ errors?: FormErrors }>()
</script>

<template>
  <Form :errors="errors">
    <Field.Root name="name">
      <Field.Label>Name</Field.Label>
      <Field.Control data-testid="name" />
      <Field.Error data-testid="name-error" />
    </Field.Root>
  </Form>
</template>

<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const form = useTemplateRef<{ validate: (fieldName?: string) => void }>('form')
</script>

<template>
  <Form ref="form">
    <Field.Root name="username">
      <Field.Label>Username</Field.Label>
      <Field.Control data-testid="username" required />
      <Field.Error data-testid="username-error" />
    </Field.Root>
    <Field.Root name="email" :validate="() => 'Invalid email'">
      <Field.Label>Email</Field.Label>
      <Field.Control data-testid="email" />
      <Field.Error data-testid="email-error" />
    </Field.Root>
  </Form>

  <button type="button" data-testid="validate-all" @click="form?.validate()">Validate all</button>
  <button type="button" data-testid="validate-email" @click="form?.validate('email')">
    Validate email
  </button>
</template>

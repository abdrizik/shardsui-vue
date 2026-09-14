<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form :errors="{ email: 'Email is already taken' }">
    <Field.Root>
      <Field.Control name="email" />
      <Field.Error data-testid="default-error" />
    </Field.Root>
  </Form>
</template>

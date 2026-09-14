<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form :errors="{ username: 'Username is reserved' }">
    <Field.Root name="username" :validate="() => 'Client validation error'">
      <Field.Control />
      <Field.Error data-testid="custom-error" match="customError" />
      <Field.Error data-testid="default-error" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

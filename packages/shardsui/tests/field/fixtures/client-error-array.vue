<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root :validate="() => ['First error', 'Second error']">
      <Field.Control />
      <Field.Error data-testid="default-error" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="username">
      <Field.Control value="" required />
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

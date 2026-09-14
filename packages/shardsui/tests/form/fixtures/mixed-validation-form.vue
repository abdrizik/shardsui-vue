<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{ onFormSubmit?: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="custom" :validate="() => 'custom error'">
      <Field.Control data-testid="custom" />
    </Field.Root>
    <Field.Root name="native">
      <Field.Control data-testid="native" required />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

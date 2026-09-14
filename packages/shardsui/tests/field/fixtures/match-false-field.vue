<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { formError } = defineProps<{ formError?: string }>()
</script>

<template>
  <Form :errors="formError ? { username: formError } : {}">
    <Field.Root name="username">
      <Field.Control data-testid="control" value="admin" required />
      <Field.Error match="valueMissing" data-testid="value-missing-error">
        Username is required.
      </Field.Error>
      <Field.Error :match="false" data-testid="default-error" />
    </Field.Root>
  </Form>
</template>

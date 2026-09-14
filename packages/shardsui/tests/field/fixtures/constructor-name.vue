<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form :errors="{}">
    <Field.Root name="constructor">
      <Field.Control />
      <Field.Error data-testid="default-error" />
    </Field.Root>
  </Form>
</template>

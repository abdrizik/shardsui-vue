<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root :validate="(val) => (val === 'ab' ? 'custom error' : null)">
      <Field.Control required />
      <Field.Error match="valueMissing">value missing</Field.Error>
      <Field.Error match="customError" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root :validate="() => 'error'">
      <Field.Control />
      <Field.Error match="customError">Message</Field.Error>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

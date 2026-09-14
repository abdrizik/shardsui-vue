<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root>
      <Field.Control required />
      <Field.Error>Message</Field.Error>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root>
      <Field.Control required minlength="2" />
      <Field.Error match="valueMissing">Message</Field.Error>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

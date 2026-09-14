<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form :errors="{ name: 'Server error' }">
    <Field.Root name="name" disabled>
      <Field.Control data-testid="control" />
    </Field.Root>
  </Form>
</template>

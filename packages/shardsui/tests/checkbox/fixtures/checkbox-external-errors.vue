<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form :errors="{ test: 'test' }">
    <Field.Root name="test">
      <Checkbox.Root data-testid="checkbox" />
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
</template>

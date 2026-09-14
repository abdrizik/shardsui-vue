<script setup lang="ts">
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root name="group" :validate="() => 'Invalid group'">
      <CheckboxGroup :value="[]" />
    </Field.Root>
    <Field.Root name="email">
      <Field.Control required data-testid="email" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { validate, onValueChange } = defineProps<{
  validate: FieldValidator
  onValueChange: (value: string) => void
}>()
</script>

<template>
  <Form :errors="{ message: 'Server error' }">
    <Field.Root name="message" validation-mode="onChange" :validate="validate">
      <Field.Control data-testid="control" @update:value="(next) => onValueChange(String(next))" />
      <Field.Error />
    </Field.Root>
  </Form>
</template>

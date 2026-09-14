<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{
  validate?: FieldValidator
  onSubmit?: (event: SubmitEvent) => void
}>()
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root :validate="validate">
      <Field.Control />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

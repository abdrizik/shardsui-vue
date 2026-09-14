<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'
import { Form } from '@/components/form'

const {
  validate,
  validationMode = 'onChange',
  onSubmit
} = defineProps<{
  validate?: FieldValidator
  validationMode?: FormValidationMode
  onSubmit?: (event: SubmitEvent) => void
}>()
</script>

<template>
  <Form :errors="{ name: 'server error' }" :on-submit="onSubmit">
    <Field.Root name="name" invalid :validate="validate" :validation-mode="validationMode">
      <Field.Control data-testid="name" />
      <Field.Error data-testid="name-error" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

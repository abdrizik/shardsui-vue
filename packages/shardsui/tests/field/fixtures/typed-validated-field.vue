<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Form, type FormValidationMode } from '@/components/form'

const {
  validate,
  validationMode = 'onBlur',
  validationDebounceTime,
  type = 'text',
  required = undefined,
  value,
  useForm = false
} = defineProps<{
  validate?: FieldValidator
  validationMode?: FormValidationMode
  validationDebounceTime?: number
  type?: string
  required?: boolean
  value?: string
  useForm?: boolean
}>()
</script>

<template>
  <Form v-if="useForm">
    <Field.Root
      :validate="validate"
      :validation-mode="validationMode"
      :validation-debounce-time="validationDebounceTime"
    >
      <Field.Label data-testid="label">Label</Field.Label>
      <Field.Control data-testid="control" :type="type" :required="required" :value="value" />
      <Field.Description data-testid="description">Description</Field.Description>
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit" data-testid="submit">submit</button>
  </Form>
  <Field.Root
    v-else
    :validate="validate"
    :validation-mode="validationMode"
    :validation-debounce-time="validationDebounceTime"
  >
    <Field.Label data-testid="label">Label</Field.Label>
    <Field.Control data-testid="control" :type="type" :required="required" :value="value" />
    <Field.Description data-testid="description">Description</Field.Description>
    <Field.Error data-testid="error" />
  </Field.Root>
</template>

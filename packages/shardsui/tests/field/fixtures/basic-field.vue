<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'

const {
  name,
  invalid = undefined,
  disabled = undefined,
  validate,
  required = undefined,
  validationMode,
  validationDebounceTime,
  dirty = undefined,
  touched = undefined
} = defineProps<{
  name?: string
  invalid?: boolean
  disabled?: boolean
  validate?: FieldValidator
  required?: boolean
  validationMode?: FormValidationMode
  validationDebounceTime?: number
  dirty?: boolean
  touched?: boolean
}>()
</script>

<template>
  <Field.Root
    :name="name"
    :invalid="invalid"
    :disabled="disabled"
    :validate="validate"
    :validation-mode="validationMode"
    :validation-debounce-time="validationDebounceTime"
    :dirty="dirty"
    :touched="touched"
  >
    <Field.Label>My Label</Field.Label>
    <Field.Control :required="required" />
    <Field.Description>Helpful hint</Field.Description>
    <Field.Error>Error message</Field.Error>
  </Field.Root>
</template>

<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'

const {
  validate,
  validationMode = 'onBlur',
  validationDebounceTime
} = defineProps<{
  validate?: FieldValidator
  validationMode?: FormValidationMode
  validationDebounceTime?: number
}>()
</script>

<template>
  <Field.Root
    :validate="validate"
    :validation-mode="validationMode"
    :validation-debounce-time="validationDebounceTime"
  >
    <Field.Label>Label</Field.Label>
    <Field.Control data-testid="control" />
    <Field.Description data-testid="description">Description</Field.Description>
    <Field.Error data-testid="error" />
  </Field.Root>
</template>

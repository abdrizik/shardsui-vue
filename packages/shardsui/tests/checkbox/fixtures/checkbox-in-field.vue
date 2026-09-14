<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'

const {
  disabled = false,
  invalid = undefined,
  name,
  required = false,
  validate,
  validationMode
} = defineProps<{
  disabled?: boolean
  invalid?: boolean
  name?: string
  required?: boolean
  validate?: FieldValidator
  validationMode?: FormValidationMode
}>()

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <Field.Root
    :disabled="disabled"
    :invalid="invalid"
    :name="name"
    :validate="validate"
    :validation-mode="validationMode"
  >
    <Field.Label>Label</Field.Label>
    <Checkbox.Root v-model:checked="checked" :required="required" data-testid="checkbox">
      <Checkbox.Indicator />
    </Checkbox.Root>
    <Field.Description data-testid="description">Description</Field.Description>
    <Field.Error data-testid="error">Error</Field.Error>
  </Field.Root>
</template>

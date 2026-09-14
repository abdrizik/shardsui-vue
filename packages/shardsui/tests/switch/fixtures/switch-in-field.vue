<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'
import { Switch } from '@/components/switch'

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  name,
  required = false,
  validate,
  validationMode
} = defineProps<{
  disabled?: boolean
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
    :name="name"
    :validate="validate"
    :validation-mode="validationMode"
  >
    <Field.Label>Label</Field.Label>
    <Switch.Root
      v-model:checked="checked"
      :required="required"
      data-testid="switch"
      v-bind="$attrs"
    >
      <Switch.Thumb />
    </Switch.Root>
    <Field.Description data-testid="description">Description</Field.Description>
    <Field.Error data-testid="error">Error</Field.Error>
  </Field.Root>
</template>

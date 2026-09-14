<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field, type FieldValidator } from '@/components/field'
import { Form, type FormValidationMode } from '@/components/form'

const {
  validationMode = 'onBlur',
  validate,
  required = false,
  invalid = undefined,
  useForm = false
} = defineProps<{
  validationMode?: FormValidationMode
  validate?: FieldValidator
  required?: boolean
  invalid?: boolean
  useForm?: boolean
}>()
</script>

<template>
  <Form v-if="useForm">
    <Field.Root :validation-mode="validationMode" :validate="validate" :invalid="invalid">
      <Checkbox.Root data-testid="checkbox" :required="required" />
      <Field.Description data-testid="description">Description</Field.Description>
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit" data-testid="submit">submit</button>
  </Form>
  <Field.Root v-else :validation-mode="validationMode" :validate="validate" :invalid="invalid">
    <Checkbox.Root data-testid="checkbox" :required="required" />
    <Field.Description data-testid="description">Description</Field.Description>
    <Field.Error data-testid="error" />
  </Field.Root>
</template>

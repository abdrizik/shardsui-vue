<script setup lang="ts">
import { Field, type FieldValidator, type FieldValidityState } from '@/components/field'
import { Form, type FormValidationMode } from '@/components/form'

const {
  onValidity,
  validate,
  validationMode,
  required = false,
  withForm = false
} = defineProps<{
  onValidity: (data: FieldValidityState) => void
  validate?: FieldValidator
  validationMode?: FormValidationMode
  required?: boolean
  withForm?: boolean
}>()
</script>

<template>
  <Form v-if="withForm">
    <Field.Root :validate="validate" :validation-mode="validationMode">
      <Field.Control :required="required" data-testid="control" />
      <Field.Validity v-slot="data">{{ onValidity(data) }}</Field.Validity>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
  <Field.Root v-else :validate="validate" :validation-mode="validationMode">
    <Field.Control :required="required" data-testid="control" />
    <Field.Validity v-slot="data">{{ onValidity(data) }}</Field.Validity>
  </Field.Root>
</template>

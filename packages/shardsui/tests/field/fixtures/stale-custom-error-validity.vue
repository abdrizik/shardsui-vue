<script setup lang="ts">
import { Field, type FieldValidityState } from '@/components/field'
import { Form, type FormValidationMode } from '@/components/form'

const { onValidity, validate, validationMode } = defineProps<{
  onValidity: (data: FieldValidityState) => void
  validate: () => string
  validationMode: FormValidationMode
}>()
</script>

<template>
  <Form>
    <Field.Root :validation-mode="validationMode" :validate="validate">
      <Field.Control required data-testid="control" />
      <Field.Error match="valueMissing">Required</Field.Error>
      <Field.Validity v-slot="data">{{ onValidity(data) }}</Field.Validity>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

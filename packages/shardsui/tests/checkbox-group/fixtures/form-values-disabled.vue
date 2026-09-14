<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit, validateGroup, validateOther } = defineProps<{
  onFormSubmit: (values: Record<string, unknown>) => void
  validateGroup: FieldValidator
  validateOther: FieldValidator
}>()

const disabled = shallowRef(true)
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="fruits" :validate="validateGroup">
      <CheckboxGroup :value="['apple', 'banana']">
        <Checkbox.Root value="apple" />
        <Checkbox.Root value="banana" :disabled="disabled" />
      </CheckboxGroup>
    </Field.Root>
    <Field.Root name="other" :validate="validateOther">
      <Field.Control value="value" />
    </Field.Root>
    <button type="button" @click="disabled = false">Enable</button>
    <button type="submit">Submit</button>
  </Form>
</template>

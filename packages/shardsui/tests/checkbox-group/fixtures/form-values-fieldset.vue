<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'
import { Fieldset } from '@/components/fieldset'
import { Form } from '@/components/form'

const { onFormSubmit, validate } = defineProps<{
  onFormSubmit: (values: Record<string, unknown>) => void
  validate: FieldValidator
}>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="fruits">
      <CheckboxGroup :value="['apple', 'banana']">
        <Checkbox.Root value="apple" />
        <Fieldset.Root disabled>
          <Checkbox.Root value="banana" />
        </Fieldset.Root>
      </CheckboxGroup>
    </Field.Root>
    <Field.Root name="other" :validate="validate">
      <Field.Control value="value" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

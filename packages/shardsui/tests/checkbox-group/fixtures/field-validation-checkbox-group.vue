<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const {
  validationMode,
  validate,
  value = []
} = defineProps<{
  validationMode?: 'onSubmit' | 'onBlur' | 'onChange'
  validate?: FieldValidator
  value?: string[]
}>()
</script>

<template>
  <Form>
    <Field.Root :validate="validate" :validation-mode="validationMode" name="test">
      <CheckboxGroup :value="value">
        <Field.Item>
          <Checkbox.Root value="one" data-testid="checkbox" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="two" data-testid="checkbox" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="three" data-testid="checkbox" />
        </Field.Item>
      </CheckboxGroup>
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

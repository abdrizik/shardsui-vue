<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Teleport to="body">
      <div>
        <Field.Root name="fruits">
          <CheckboxGroup :value="['apple', 'banana']">
            <Checkbox.Root value="apple" />
            <Checkbox.Root value="banana" disabled />
          </CheckboxGroup>
        </Field.Root>
      </div>
    </Teleport>
    <button type="submit">Submit</button>
  </Form>
</template>

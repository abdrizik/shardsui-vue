<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="fruits">
      <CheckboxGroup :value="['apple']">
        <Teleport to="body">
          <div>
            <Checkbox.Root value="apple" />
          </div>
        </Teleport>
      </CheckboxGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

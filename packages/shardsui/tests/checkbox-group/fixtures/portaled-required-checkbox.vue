<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <Teleport to="body">
          <div>
            <Checkbox.Root value="portaled" required data-testid="portaled" />
          </div>
        </Teleport>
        <Checkbox.Root value="current" />
      </CheckboxGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
}
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root name="protocols">
      <CheckboxGroup :value="[]">
        <Field.Item>
          <Checkbox.Root value="http" data-testid="checkbox" required />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="https" data-testid="checkbox" required />
        </Field.Item>
      </CheckboxGroup>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

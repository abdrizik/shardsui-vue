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
          <Checkbox.Root value="https" data-testid="cb-enabled" required />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="http" data-testid="cb-disabled" required disabled />
        </Field.Item>
      </CheckboxGroup>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>

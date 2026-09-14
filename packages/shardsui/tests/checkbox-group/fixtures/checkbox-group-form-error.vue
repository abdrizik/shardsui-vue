<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const errors = shallowRef<Record<string, string | string[]>>({})

function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  errors.value = { group: 'server error' }
}
</script>

<template>
  <Form :errors="errors" :on-submit="onSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="['one']">
        <Field.Item>
          <Checkbox.Root value="one" data-testid="checkbox-one" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="two" data-testid="checkbox-two" />
        </Field.Item>
      </CheckboxGroup>
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

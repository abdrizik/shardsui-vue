<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form :errors="{ group: 'error' }">
    <Field.Root name="group">
      <CheckboxGroup :value="['one']">
        <Field.Item>
          <Checkbox.Root value="one" />
          <Field.Description>Description</Field.Description>
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="two" />
        </Field.Item>
      </CheckboxGroup>
      <Field.Error data-testid="error" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
</script>

<template>
  <Form>
    <Field.Root name="group">
      <CheckboxGroup :value="['one']">
        <Field.Item>
          <Checkbox.Root value="one" data-testid="checkbox" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="two" data-testid="checkbox" required />
        </Field.Item>
      </CheckboxGroup>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>

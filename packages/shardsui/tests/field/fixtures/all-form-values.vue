<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'

const { validateSpy } = defineProps<{ validateSpy: FieldValidator }>()
</script>

<template>
  <Form>
    <Field.Root name="checkbox">
      <Checkbox.Root :checked="true" />
    </Field.Root>

    <Field.Root name="checkbox-group">
      <CheckboxGroup :value="['apple', 'banana']">
        <Field.Item>
          <Checkbox.Root value="apple" />
        </Field.Item>
        <Field.Item>
          <Checkbox.Root value="banana" />
        </Field.Item>
      </CheckboxGroup>
    </Field.Root>

    <Field.Root name="input" :validate="validateSpy">
      <Field.Control data-testid="input" type="url" value="https://example.com" />
    </Field.Root>

    <button type="submit">submit</button>
  </Form>
</template>

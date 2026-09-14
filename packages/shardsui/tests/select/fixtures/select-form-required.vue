<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'

const {
  errors,
  required = false,
  matchError = false
} = defineProps<{
  errors?: Record<string, string | string[]>
  required?: boolean
  matchError?: boolean
}>()
</script>

<template>
  <Form :errors="errors">
    <Field.Root name="select" data-testid="field">
      <Select.Root :required="required">
        <Select.Trigger data-testid="trigger">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="a">a</Select.Item>
              <Select.Item value="b">b</Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
      <Field.Error v-if="matchError" match="valueMissing" data-testid="error">required</Field.Error>
      <Field.Error v-else data-testid="error" />
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>

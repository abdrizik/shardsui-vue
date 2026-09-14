<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'

const { validate = ((val: unknown) => (val === '2' ? 'error' : null)) as FieldValidator } =
  defineProps<{ validate?: FieldValidator }>()
</script>

<template>
  <Form>
    <Field.Root :validate="validate">
      <Select.Root required>
        <Select.Trigger data-testid="trigger">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="1">Option 1</Select.Item>
              <Select.Item value="2">Option 2</Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
    <button type="submit" data-testid="submit">submit</button>
  </Form>
</template>

<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'

const {
  withField = false,
  disabled = false,
  readOnly = false,
  onValueChange
} = defineProps<{
  withField?: boolean
  disabled?: boolean
  readOnly?: boolean
  onValueChange?: (value: unknown) => void
}>()
</script>

<template>
  <Form v-if="withField" :errors="{ select: 'test' }">
    <Field.Root name="select">
      <Select.Root :disabled="disabled" :read-only="readOnly" @update:value="onValueChange">
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
      <Field.Error data-testid="error" />
    </Field.Root>
  </Form>
  <Select.Root
    v-else
    name="select"
    :disabled="disabled"
    :read-only="readOnly"
    @update:value="onValueChange"
  >
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
</template>

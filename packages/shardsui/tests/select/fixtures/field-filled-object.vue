<script setup lang="ts">
import { Field } from '@/components/field'
import { Select } from '@/components/select'

type Item = { id: number; label: string }

const emptyValue: Item = { id: 1, label: 'Empty option' }
</script>

<template>
  <Field.Root>
    <Select.Root
      :value="emptyValue"
      :item-to-string-label="(item: Item) => item.label"
      :item-to-string-value="() => ''"
    >
      <Select.Trigger data-testid="trigger" />
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item :value="emptyValue">Empty option</Select.Item>
            <Select.Item :value="{ id: 2, label: 'Option 1' }">Option 1</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Field.Root>
</template>

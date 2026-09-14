<script setup lang="ts">
import { Select } from '@/components/select'

const {
  onValueChange,
  items,
  itemToStringLabel,
  itemToStringValue,
  multiple = false,
  placeholder
} = defineProps<{
  onValueChange?: (value: unknown) => void
  items?: readonly unknown[] | Record<string, unknown>
  itemToStringLabel?: (item: unknown) => string
  itemToStringValue?: (item: unknown) => string
  multiple?: boolean
  placeholder?: string
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Select.Root
    v-model:value="value"
    :items="items as never"
    :item-to-string-label="itemToStringLabel"
    :item-to-string-value="itemToStringValue"
    :multiple="multiple"
    @update:value="onValueChange"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" :placeholder="placeholder" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup data-testid="popup">
          <Select.Item value="1">one</Select.Item>
          <Select.Item value="2">two</Select.Item>
          <Select.Item value="3">three</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

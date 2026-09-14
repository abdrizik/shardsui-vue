<script setup lang="ts">
import { Select } from '@/components/select'

const {
  value = undefined,
  items = undefined,
  itemToStringValue,
  itemToStringLabel,
  placeholder = 'Select an option'
} = defineProps<{
  value?: unknown
  items?: readonly { label: unknown; value: unknown }[] | Record<string, unknown> | undefined
  itemToStringValue?: (item: unknown) => string
  itemToStringLabel?: (item: unknown) => string
  placeholder?: string
}>()
</script>

<template>
  <Select.Root
    :value="value as never"
    :items="items as never"
    :item-to-string-value="itemToStringValue"
    :item-to-string-label="itemToStringLabel"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" :placeholder="placeholder" />
    </Select.Trigger>
  </Select.Root>
</template>

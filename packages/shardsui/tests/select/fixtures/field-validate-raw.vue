<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Select } from '@/components/select'

type Item = { code: string; label: string }

const {
  items = [
    { code: 'US', label: 'United States' },
    { code: 'CA', label: 'Canada' }
  ],
  validate
} = defineProps<{
  items?: Item[]
  validate?: FieldValidator
}>()
</script>

<template>
  <Field.Root validation-mode="onBlur" :validate="validate">
    <Select.Root
      :value="items[0]"
      :item-to-string-label="(item: Item) => item.label"
      :item-to-string-value="(item: Item) => item.code"
    >
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner />
      </Select.Portal>
    </Select.Root>
  </Field.Root>
</template>

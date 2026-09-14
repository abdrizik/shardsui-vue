<script setup lang="ts">
import { Select } from '@/components/select'

const {
  onValueChange,
  onOpenChange,
  disabled = false,
  readOnly = false,
  required = false,
  name,
  placeholder = 'Pick one',
  items,
  itemToStringLabel,
  itemToStringValue
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  readOnly?: boolean
  required?: boolean
  name?: string
  placeholder?: string
  items?: readonly unknown[]
  itemToStringLabel?: (item: unknown) => string
  itemToStringValue?: (item: unknown) => string
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Select.Root
    v-model:value="value"
    v-model:open="open"
    :disabled="disabled"
    :read-only="readOnly"
    :required="required"
    :name="name"
    :items="items as never"
    :item-to-string-label="itemToStringLabel"
    :item-to-string-value="itemToStringValue"
    @update:value="onValueChange"
    @update:open="onOpenChange"
  >
    <Select.Trigger>
      <Select.Value :placeholder="placeholder" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <template v-if="items && itemToStringLabel">
            <Select.Item v-for="(item, i) in items" :key="i" :value="item">
              {{ itemToStringLabel(item) }}
            </Select.Item>
          </template>
          <template v-else>
            <Select.Item value="a">Option A</Select.Item>
            <Select.Item value="b">Option B</Select.Item>
            <Select.Item value="c">Option C</Select.Item>
          </template>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

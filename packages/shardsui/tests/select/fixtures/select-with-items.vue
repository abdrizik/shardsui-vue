<script setup lang="ts">
import { Select } from '@/components/select'

const {
  onValueChange,
  onOpenChange,
  name,
  items,
  itemToStringLabel,
  itemToStringValue,
  autoComplete,
  multiple = false,
  placeholder = 'Pick one'
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
  name?: string
  items?: readonly unknown[]
  itemToStringLabel?: (item: unknown) => string
  itemToStringValue?: (item: unknown) => string
  autoComplete?: string
  multiple?: boolean
  placeholder?: string
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Select.Root
    v-model:value="value"
    :name="name"
    :items="items as never"
    :item-to-string-label="itemToStringLabel"
    :item-to-string-value="itemToStringValue"
    :auto-complete="autoComplete"
    :multiple="multiple"
    @update:value="onValueChange"
    @update:open="onOpenChange"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" :placeholder="placeholder" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup data-testid="popup">
          <template v-if="items">
            <Select.Item v-for="(item, i) in items" :key="i" :value="item">
              {{ itemToStringLabel ? itemToStringLabel(item) : String(item) }}
            </Select.Item>
          </template>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

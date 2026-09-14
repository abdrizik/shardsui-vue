<script setup lang="ts">
import { computed } from 'vue'
import { Select } from '@/components/select'

const { items, itemsArray, onValueChange } = defineProps<{
  items?: Record<string, string> | undefined
  itemsArray?: Array<{ value: string; label: string }> | undefined
  onValueChange?: (v: unknown) => void
}>()

const value = defineModel<unknown>('value')

// This generic harness forwards an `unknown` value, so keep `Select.Root`'s `Value` inference
// loose rather than letting `items` pin it.
const resolvedItems = computed(
  () =>
    (items ?? itemsArray) as
      | readonly { label: unknown; value: unknown }[]
      | Record<string, unknown>
      | undefined
)
</script>

<template>
  <Select.Root v-model:value="value" :items="resolvedItems as never" @update:value="onValueChange">
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <template v-if="items">
            <Select.Item v-for="(label, v) in items" :key="v" :value="v">{{ label }}</Select.Item>
          </template>
          <template v-else-if="itemsArray">
            <Select.Item v-for="item in itemsArray" :key="item.value" :value="item.value">
              {{ item.label }}
            </Select.Item>
          </template>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

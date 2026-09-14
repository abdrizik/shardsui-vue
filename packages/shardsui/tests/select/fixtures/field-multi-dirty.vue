<script setup lang="ts">
import { Field } from '@/components/field'
import { Select } from '@/components/select'

const { mode = 'string', isItemEqualToValue } = defineProps<{
  mode?: 'string' | 'object'
  isItemEqualToValue?: (a: unknown, b: unknown) => boolean
}>()

const value = defineModel<unknown[]>('value')
const open = defineModel<boolean>('open', { default: true })

const objItems = [
  { value: 'a', label: 'a' },
  { value: 'b', label: 'b' }
]
</script>

<template>
  <Field.Root>
    <Select.Root
      multiple
      v-model:open="open"
      v-model:value="value as never"
      :is-item-equal-to-value="isItemEqualToValue"
    >
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <template v-if="mode === 'object'">
              <Select.Item v-for="item in objItems" :key="item.value" :value="item">
                {{ item.label }}
              </Select.Item>
            </template>
            <template v-else>
              <Select.Item value="a">a</Select.Item>
              <Select.Item value="b">b</Select.Item>
            </template>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Field.Root>
</template>

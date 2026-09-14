<script setup lang="ts">
import { Select } from '@/components/select'

type Country = { id: number; name: string; code: string }

const countries: Country[] = [
  { id: 1, name: 'Argentina', code: 'AR' },
  { id: 2, name: 'Brazil', code: 'BR' }
]

const {
  isItemEqualToValue = undefined,
  itemToStringLabel = undefined,
  itemToStringValue = undefined
} = defineProps<{
  isItemEqualToValue?: (item: Country, value: Country) => boolean
  itemToStringLabel?: (item: Country) => string
  itemToStringValue?: (item: Country) => string
}>()

const value = defineModel<Country | null>('value', { default: null })
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Select.Root
    v-model:value="value"
    v-model:open="open"
    name="country"
    :items="countries as never"
    :is-item-equal-to-value="isItemEqualToValue"
    :item-to-string-label="itemToStringLabel"
    :item-to-string-value="itemToStringValue"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup data-testid="popup">
          <Select.List data-testid="list">
            <Select.Item
              v-for="country in countries"
              :key="country.id"
              :value="country"
              :data-testid="`item-${country.id}`"
            >
              {{ country.name }}
            </Select.Item>
          </Select.List>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>

<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

type Country = { id: number; name: string; code: string }

const countries: Country[] = [
  { id: 1, name: 'Argentina', code: 'AR' },
  { id: 2, name: 'Brazil', code: 'BR' }
]

const {
  onInputValueChange = undefined,
  onOpenChange = undefined,
  isItemEqualToValue = undefined,
  itemToStringValue = undefined,
  itemToStringLabel = undefined,
  filter = undefined
} = defineProps<{
  onInputValueChange?: (value: string) => void
  onOpenChange?: (open: boolean) => void
  isItemEqualToValue?: (item: Country, value: Country) => boolean
  itemToStringValue?: (item: Country) => string
  itemToStringLabel?: (item: Country) => string
  filter?: null | ((item: Country, query: string) => boolean)
}>()

const value = defineModel<Country | null>('value', { default: null })
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Combobox.Root
    v-model:value="value"
    v-model:open="open"
    name="country"
    :items="countries"
    @update:input-value="onInputValueChange"
    @update:open="onOpenChange"
    :is-item-equal-to-value="isItemEqualToValue"
    :item-to-string-value="itemToStringValue"
    :item-to-string-label="itemToStringLabel"
    :filter="filter"
  >
    <Combobox.Input data-testid="input" />
    <span data-testid="value">
      <Combobox.Value />
    </span>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <ItemsList :label="(item: unknown) => (item as Country).name" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

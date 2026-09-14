<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const items = [
  { country: 'United States', code: 'US' },
  { country: 'Canada', code: 'CA' },
  { country: 'Australia', code: 'AU' }
]

const {
  onValueChange = undefined,
  name = undefined,
  multiple = false
} = defineProps<{
  onValueChange?: (value: unknown) => void
  name?: string
  multiple?: boolean
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    v-model:value="value"
    @update:value="onValueChange"
    :open="open"
    :name="name"
    :multiple="multiple"
    :items="items"
    :item-to-string-value="(item: unknown) => (item as (typeof items)[0]).code"
    :item-to-string-label="(item: unknown) => (item as (typeof items)[0]).country"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in items" :key="item.code" :value="item">
              {{ item.country }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'

type Country = { code: string; label: string }

const {
  countries,
  inputInsidePopup = false,
  isItemEqualToValue = (item: Country, v: Country) => item?.code === v?.code,
  initialValue
} = defineProps<{
  countries?: Country[]
  inputInsidePopup?: boolean
  isItemEqualToValue?: (item: Country, v: Country) => boolean
  initialValue?: Country
}>()

const value = shallowRef<Country | null>(initialValue ?? null)
const inputValue = shallowRef('')
</script>

<template>
  <Combobox.Root
    :items="countries"
    :filter="null"
    v-model:value="value"
    v-model:input-value="inputValue"
    :is-item-equal-to-value="isItemEqualToValue"
    :item-to-string-label="(item: Country) => item.label"
  >
    <Combobox.Input v-if="!inputInsidePopup" data-testid="input" />
    <Combobox.Trigger v-else data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <template v-if="inputInsidePopup">
            <Combobox.Input data-testid="input" />
            <Combobox.Empty data-testid="empty">No countries found.</Combobox.Empty>
          </template>
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="country in countries ?? []" :key="country.code" :value="country">
              {{ country.label }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import { createFilter } from '@/internal/create-filter'
import VirtualizedNoIndexList from './virtualized-no-index-list.vue'

const { onValueChange, items = ['one', 'two', 'three', 'four', 'five'] } = defineProps<{
  onValueChange?: (value: unknown) => void
  items?: string[]
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')

const filter = createFilter()
const inputValue = shallowRef('')
const filteredItems = computed(() =>
  inputValue.value.trim() === ''
    ? items
    : items.filter((item) => filter.contains(item, inputValue.value))
)
</script>

<template>
  <Combobox.Root
    virtualized
    v-model:input-value="inputValue"
    :filtered-items="filteredItems"
    :filter="null"
    v-model:value="value"
    v-model:open="open"
    @update:value="onValueChange"
  >
    <Combobox.Input data-testid="input" placeholder="Search..." />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <VirtualizedNoIndexList :items="filteredItems" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

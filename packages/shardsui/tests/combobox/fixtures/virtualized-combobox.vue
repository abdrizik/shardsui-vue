<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import { createFilter } from '@/internal/create-filter'
import VirtualizedList from './virtualized-list.vue'

const {
  onValueChange,
  count = 100,
  windowSize = 5
} = defineProps<{
  onValueChange?: (value: unknown) => void
  count?: number
  windowSize?: number
}>()

const value = defineModel<string | null>('value')
const open = defineModel<boolean>('open')

const allItems = computed(() => Array.from({ length: count }, (_, i) => `item-${i}`))
const filter = createFilter()
const inputValue = shallowRef('')
const filteredItems = computed(() =>
  inputValue.value.trim() === ''
    ? allItems.value
    : allItems.value.filter((item) => filter.contains(item, inputValue.value))
)

const windowStart = shallowRef(0)

function handleItemHighlighted(item: string | undefined) {
  if (item == null) return
  const index = filteredItems.value.indexOf(item)
  if (index < 0) return
  windowStart.value = Math.max(
    0,
    Math.min(index - (windowSize >> 1), Math.max(0, filteredItems.value.length - windowSize))
  )
}
</script>

<template>
  <Combobox.Root
    virtualized
    v-model:input-value="inputValue"
    :filtered-items="filteredItems"
    :filter="null"
    v-model:value="value"
    :open="open"
    @update:value="onValueChange"
    @item-highlighted="handleItemHighlighted as never"
  >
    <Combobox.Input data-testid="input" placeholder="Search..." />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <VirtualizedList
            :items="filteredItems"
            :window-start="windowStart"
            :window-size="windowSize"
          />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

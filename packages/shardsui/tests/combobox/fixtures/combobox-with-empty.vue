<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import { createFilter } from '@/internal/create-filter'

const {
  items = ['Apple', 'Banana', 'Cherry'],
  inputValue = '',
  onValueChange,
  as = 'div'
} = defineProps<{
  items?: string[]
  inputValue?: string
  onValueChange?: (value: unknown) => void
  as?: keyof HTMLElementTagNameMap
}>()

const open = defineModel<boolean>('open')

const filter = createFilter({ sensitivity: 'base' })

const inputVal = shallowRef(inputValue)

const filteredItems = computed(() =>
  inputVal.value === '' ? items : items.filter((item) => filter.contains(item, inputVal.value))
)
</script>

<template>
  <Combobox.Root
    v-model:open="open"
    @update:value="onValueChange"
    @update:input-value="(v: string) => (inputVal = v)"
  >
    <Combobox.Input data-testid="input" placeholder="Search..." />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.Empty :as="as" data-testid="empty">No results</Combobox.Empty>
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in filteredItems" :key="item" :value="item.toLowerCase()">
              {{ item }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import type { HighlightReason } from '@/components/combobox/item-registry'

type TestItem = { id: number; label: string; label2: string }

const {
  mode = 'contains',
  items = [
    { id: 1, label: 'apple', label2: 'one' },
    { id: 2, label: 'orange', label2: 'two' },
    { id: 3, label: 'banana', label2: 'three' }
  ],
  fruits = ['Apple', 'Banana', 'Zucchini'],
  autoHighlight = false,
  onItemHighlighted
} = defineProps<{
  mode?: 'contains' | 'reverse'
  items?: TestItem[]
  fruits?: string[]
  autoHighlight?: boolean
  onItemHighlighted?: (value: unknown, reason: HighlightReason, index: number) => void
}>()

const searchValue = shallowRef('')
const value = shallowRef<TestItem | null>(null)

function labelToFilter(item: TestItem | null) {
  return item ? `${item.label} ${item.label2}` : ''
}

function labelToDisplay(item: TestItem | null) {
  return item ? item.label || item.label2 : ''
}

const filteredObjects = computed(() =>
  items.filter((item) =>
    labelToFilter(item).toLowerCase().includes(searchValue.value.toLowerCase())
  )
)

const reorderedStrings = computed(() =>
  searchValue.value.length > 0 ? [...fruits].reverse() : fruits
)
</script>

<template>
  <Combobox.Root
    v-if="mode === 'contains'"
    :items="items"
    :filtered-items="filteredObjects"
    :input-value="searchValue"
    @update:input-value="(next: string) => (searchValue = next)"
    :value="value"
    @update:value="(next: unknown) => (value = next as TestItem | null)"
    :item-to-string-label="labelToDisplay as never"
    :is-item-equal-to-value="(item: TestItem | null, v: TestItem | null) => item?.id === v?.id"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.Empty data-testid="empty">No items found.</Combobox.Empty>
          <Combobox.List data-testid="list">
            <Combobox.Collection v-slot="{ item }">
              <Combobox.Item :value="item">{{ (item as TestItem).label }}</Combobox.Item>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
  <Combobox.Root
    v-else
    :auto-highlight="autoHighlight"
    @item-highlighted="onItemHighlighted"
    :filtered-items="reorderedStrings"
    :input-value="searchValue"
    @update:input-value="(next: string) => (searchValue = next)"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Collection v-slot="{ item }">
              <Combobox.Item :value="item">{{ item }}</Combobox.Item>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

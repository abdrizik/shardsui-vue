<script setup lang="ts">
import { computed } from 'vue'
import { Combobox } from '@/components/combobox'
import type { HighlightReason } from '@/components/combobox/item-registry'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'
import ItemsList from './items-list.vue'

type RootProps = ComboboxShellProps<unknown, false>

const {
  onValueChange,
  onOpenChange,
  items,
  filteredItems,
  filter,
  limit,
  openOnInputClick = undefined,
  autoComplete,
  name,
  multiple = false,
  label = (item: unknown) => String(item),
  withIndex = false,
  autoHighlight = undefined,
  onItemHighlighted
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onOpenChange?: (open: boolean) => void
  items?: RootProps['items']
  filteredItems?: RootProps['filteredItems']
  filter?: RootProps['filter']
  limit?: number | undefined
  openOnInputClick?: boolean | undefined
  autoComplete?: string | undefined
  name?: string | undefined
  multiple?: boolean
  label?: (item: unknown) => string
  withIndex?: boolean
  autoHighlight?: boolean
  onItemHighlighted?: (value: unknown, reason: HighlightReason, index: number) => void
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')

const resolvedItems = computed(
  () => items ?? (filteredItems === undefined ? ['apple', 'banana', 'cherry'] : undefined)
)
</script>

<template>
  <Combobox.Root
    :items="resolvedItems"
    :filtered-items="filteredItems"
    :filter="filter"
    v-model:value="value"
    @update:value="onValueChange"
    v-model:open="open"
    @update:open="onOpenChange"
    :limit="limit"
    :open-on-input-click="openOnInputClick"
    :auto-complete="autoComplete"
    :name="name"
    :multiple="multiple"
    :auto-highlight="autoHighlight"
    @item-highlighted="onItemHighlighted"
  >
    <Combobox.Input data-testid="input" placeholder="Search..." />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <ItemsList :label="label" :with-index="withIndex" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

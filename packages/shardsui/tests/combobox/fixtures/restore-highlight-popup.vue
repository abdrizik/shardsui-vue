<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { HighlightReason } from '@/components/combobox/item-registry'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'
import ItemsList from './items-list.vue'

type RootProps = ComboboxShellProps<unknown, false>

const {
  items,
  staticItems,
  multiple = false,
  autoHighlight = false,
  onItemHighlighted,
  itemToStringLabel
} = defineProps<{
  items?: RootProps['items']
  staticItems?: string[]
  multiple?: boolean
  autoHighlight?: boolean
  onItemHighlighted?: (value: unknown, reason: HighlightReason, index: number) => void
  itemToStringLabel?: RootProps['itemToStringLabel']
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root
    :items="items"
    v-model:value="value"
    :multiple="multiple"
    :auto-highlight="autoHighlight"
    @item-highlighted="onItemHighlighted"
    :item-to-string-label="itemToStringLabel"
  >
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Input data-testid="input" aria-label="Search" />
          <Combobox.List v-if="staticItems" data-testid="list">
            <Combobox.Item v-for="item in staticItems" :key="item" :value="item">
              {{ item }}
            </Combobox.Item>
          </Combobox.List>
          <ItemsList v-else :label="itemToStringLabel ?? ((item: unknown) => String(item))" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

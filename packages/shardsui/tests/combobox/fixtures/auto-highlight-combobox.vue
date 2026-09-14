<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { HighlightReason } from '@/components/combobox/item-registry'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'
import ItemsList from './items-list.vue'

type RootProps = ComboboxShellProps<unknown, false>

const {
  onValueChange,
  onItemHighlighted,
  items = ['apple', 'banana', 'cherry'],
  multiple = false,
  openOnInputClick = undefined,
  useItemsProp = true
} = defineProps<{
  onValueChange?: (value: unknown) => void
  onItemHighlighted?: (value: unknown, reason: HighlightReason, index: number) => void
  items?: RootProps['items']
  multiple?: boolean
  openOnInputClick?: boolean
  useItemsProp?: boolean
}>()

const open = defineModel<boolean>('open')
const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root
    v-model:open="open"
    v-model:value="value"
    @update:value="onValueChange"
    @item-highlighted="onItemHighlighted"
    :multiple="multiple"
    :open-on-input-click="openOnInputClick"
    auto-highlight
    :items="useItemsProp ? items : undefined"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <ItemsList v-if="useItemsProp" />
          <Combobox.List v-else data-testid="list">
            <Combobox.Item value="alpha">alpha</Combobox.Item>
            <Combobox.Item value="alphabet">alphabet</Combobox.Item>
            <Combobox.Item value="beta">beta</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const {
  items = ['alpha', 'beta', 'gamma'],
  open = false,
  autoHighlight = false,
  keepHighlight = false,
  openOnInputClick = false,
  mode = 'list',
  filter = undefined,
  itemToStringValue = undefined,
  onItemHighlighted = undefined,
  getLabel = undefined
} = defineProps<{
  items?: readonly unknown[]
  open?: boolean
  autoHighlight?: boolean | 'always'
  keepHighlight?: boolean
  openOnInputClick?: boolean
  mode?: 'list' | 'both' | 'inline' | 'none'
  filter?:
    | ((item: unknown, query: string, itemToString?: (item: unknown) => string) => boolean)
    | null
  itemToStringValue?: (item: unknown) => string
  onItemHighlighted?: (highlightedValue: unknown, reason: string) => void
  getLabel?: (item: unknown) => string
}>()

const label = (item: unknown) => (getLabel ? getLabel(item) : String(item))
</script>

<template>
  <Autocomplete.Root
    :items="items"
    :open="open"
    :auto-highlight="autoHighlight"
    :keep-highlight="keepHighlight"
    :open-on-input-click="openOnInputClick"
    :mode="mode"
    :filter="filter"
    :item-to-string-value="itemToStringValue"
    @item-highlighted="onItemHighlighted as never"
  >
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item :value="item">{{ label(item) }}</Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>

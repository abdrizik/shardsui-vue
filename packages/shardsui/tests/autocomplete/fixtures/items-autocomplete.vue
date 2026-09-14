<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

type FilterFn =
  | ((item: string, query: string, itemToString?: (item: string) => string) => boolean)
  | null

const {
  items = undefined,
  mode = 'list',
  filter = undefined,
  locale = undefined,
  openOnInputClick = true
} = defineProps<{
  items?: readonly string[]
  mode?: 'list' | 'both' | 'inline' | 'none'
  filter?: FilterFn
  locale?: Intl.LocalesArgument
  openOnInputClick?: boolean
}>()
</script>

<template>
  <Autocomplete.Root
    :items="items"
    :mode="mode"
    :filter="filter"
    :locale="locale"
    :open-on-input-click="openOnInputClick"
  >
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>

<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const {
  items,
  mode = 'list',
  openOnInputClick = false
} = defineProps<{
  items: readonly string[]
  mode?: 'list' | 'both' | 'inline' | 'none'
  openOnInputClick?: boolean
}>()
</script>

<template>
  <Autocomplete.Root :items="items" :mode="mode" :open-on-input-click="openOnInputClick">
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List style="max-height: 100px; overflow-y: auto">
            <Autocomplete.Collection v-slot="{ item }">
              <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
            </Autocomplete.Collection>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>

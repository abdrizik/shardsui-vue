<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'

const allItems = ['Apple', 'Banana', 'Cherry', 'Date']

const {
  autoHighlight = false,
  openOnInputClick = false,
  onValueChange = undefined
} = defineProps<{
  autoHighlight?: boolean | 'always'
  openOnInputClick?: boolean
  onValueChange?: (value: string) => void
}>()

const value = shallowRef('')

const filtered = computed(() =>
  value.value
    ? allItems.filter((item) => item.toLowerCase().includes(value.value.toLowerCase()))
    : allItems
)
</script>

<template>
  <Autocomplete.Root
    v-model:value="value"
    :auto-highlight="autoHighlight"
    :open-on-input-click="openOnInputClick"
    @update:value="onValueChange"
  >
    <Autocomplete.Input data-testid="autocomplete-input" />

    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup data-testid="autocomplete-popup">
          <Autocomplete.List data-testid="autocomplete-list">
            <Autocomplete.Item v-for="item in filtered" :key="item" :value="item">
              {{ item }}
            </Autocomplete.Item>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>

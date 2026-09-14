<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'

const allItems = ['apple', 'banana', 'cherry']

const { keepHighlight = false, autoHighlight = false } = defineProps<{
  keepHighlight?: boolean
  autoHighlight?: boolean | 'always'
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
    :keep-highlight="keepHighlight"
    :auto-highlight="autoHighlight"
    open-on-input-click
  >
    <Autocomplete.Input data-testid="autocomplete-input" />

    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Item v-for="item in filtered" :key="item" :value="item">
              {{ item }}
            </Autocomplete.Item>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>

<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'

type Mode = 'list' | 'both' | 'inline' | 'none'

const allItems = ['apple', 'banana', 'cherry']

const { mode = 'list', openOnInputClick = false } = defineProps<{
  mode?: Mode
  openOnInputClick?: boolean
}>()

const staticMode = computed(() => mode === 'inline' || mode === 'none')
const value = shallowRef('')
const filtered = computed(() =>
  staticMode.value
    ? allItems
    : value.value
      ? allItems.filter((item) => item.toLowerCase().includes(value.value.toLowerCase()))
      : allItems
)
</script>

<template>
  <Autocomplete.Root v-model:value="value" :mode="mode" :open-on-input-click="openOnInputClick">
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

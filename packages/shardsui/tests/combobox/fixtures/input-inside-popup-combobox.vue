<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const {
  multiple = false,
  onValueChange,
  items = ['apple', 'apricot', 'banana']
} = defineProps<{
  multiple?: boolean
  onValueChange?: (value: unknown) => void
  items?: string[]
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Combobox.Root
    :items="items"
    :multiple="multiple"
    v-model:value="value"
    @update:value="onValueChange"
  >
    <Combobox.Trigger data-testid="trigger">
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup" aria-label="Demo">
          <Combobox.Input data-testid="input" aria-label="Combobox input" />
          <ItemsList />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

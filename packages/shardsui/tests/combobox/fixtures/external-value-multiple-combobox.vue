<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const {
  items,
  staticItems,
  initialValue = [],
  externalValue = []
} = defineProps<{
  items?: readonly string[]
  staticItems?: string[]
  initialValue?: string[]
  externalValue?: string[]
}>()

const value = shallowRef<string[]>(initialValue)
</script>

<template>
  <Combobox.Root :items="items" multiple v-model:value="value">
    <Combobox.Input data-testid="input" />
    <button type="button" data-testid="clear" @click="value = []">Clear</button>
    <button type="button" data-testid="set-external" @click="value = externalValue">
      Set external
    </button>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List v-if="staticItems">
            <Combobox.Item v-for="item in staticItems" :key="item" :value="item">
              {{ item }}
            </Combobox.Item>
          </Combobox.List>
          <ItemsList v-else :label="(item: unknown) => String(item)" />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { openOnInputClick = undefined, items = ['apple'] } = defineProps<{
  openOnInputClick?: boolean
  items?: readonly string[]
}>()

const open = defineModel<boolean>('open')
const inputValue = defineModel<string>('inputValue')
</script>

<template>
  <Combobox.Root
    v-model:open="open"
    v-model:input-value="inputValue"
    :open-on-input-click="openOnInputClick"
    :items="items"
    :filter="null"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <Combobox.Item v-for="item in items" :key="item" :value="item">{{
              item
            }}</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

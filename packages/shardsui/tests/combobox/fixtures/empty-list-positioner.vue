<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { items = [], withEmpty = false } = defineProps<{
  items?: readonly unknown[]
  withEmpty?: boolean
}>()

const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Combobox.Root :open="open" :items="items">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner data-testid="positioner">
        <Combobox.Popup data-testid="popup">
          <ItemsList />
          <Combobox.Empty v-if="withEmpty" data-testid="empty">No results.</Combobox.Empty>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

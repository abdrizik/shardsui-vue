<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { items = ['Apple', 'Apricot', 'Banana', 'Grape', 'Orange'], onOpenChange } = defineProps<{
  items?: string[]
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Combobox.Root :items="items" :open="true" @update:open="(next: boolean) => onOpenChange?.(next)">
    <Combobox.Trigger data-testid="trigger">Open</Combobox.Trigger>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.Input data-testid="input" />
          <ItemsList />
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>

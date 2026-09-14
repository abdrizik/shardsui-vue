<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { open = true, items = ['Apple', 'Apricot', 'Banana', 'Grape', 'Orange'] } = defineProps<{
  open?: boolean
  items?: string[]
}>()
</script>

<template>
  <Combobox.Root :items="items" :open="open" inline>
    <Combobox.Input data-testid="input" />
    <ItemsList />
  </Combobox.Root>
</template>

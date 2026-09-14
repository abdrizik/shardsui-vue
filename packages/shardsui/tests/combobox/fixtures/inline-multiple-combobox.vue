<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { open = true, items = ['apple'] } = defineProps<{ open?: boolean; items?: string[] }>()
</script>

<template>
  <Combobox.Root multiple inline :open="open" :items="items">
    <Combobox.Input data-testid="inline-input" />
    <Combobox.Trigger>Toggle</Combobox.Trigger>
    <ItemsList />
  </Combobox.Root>
</template>

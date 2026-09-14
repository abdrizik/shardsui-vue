<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { items } = defineProps<{ items: string[] }>()
</script>

<template>
  <Combobox.List data-testid="list">
    <Combobox.Item v-for="item in items" :key="item" :value="item">{{ item }}</Combobox.Item>
  </Combobox.List>
</template>

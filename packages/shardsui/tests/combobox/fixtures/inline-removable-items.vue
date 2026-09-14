<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'

const items = shallowRef<string[]>(['apple'])
</script>

<template>
  <div>
    <Combobox.Root inline open :items="items">
      <Combobox.Input data-testid="input" />
      <Combobox.List data-testid="list">
        <Combobox.Item v-for="item in items" :key="item" :value="item">{{ item }}</Combobox.Item>
      </Combobox.List>
    </Combobox.Root>
    <button type="button" @click="items = []">remove items</button>
  </div>
</template>

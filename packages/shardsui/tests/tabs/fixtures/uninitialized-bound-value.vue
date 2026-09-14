<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const value = defineModel<TabsValue>('value')
</script>

<template>
  <Tabs.Root v-model:value="value">
    <Tabs.List>
      <Tabs.Tab :value="0">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 2</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0">Panel 1</Tabs.Panel>
    <Tabs.Panel :value="1">Panel 2</Tabs.Panel>
  </Tabs.Root>

  <output data-testid="bound-value">{{ String(value) }}</output>
</template>

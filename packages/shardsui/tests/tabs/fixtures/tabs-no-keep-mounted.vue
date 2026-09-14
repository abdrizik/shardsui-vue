<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange } = defineProps<{ onValueChange?: (value: TabsValue | undefined) => void }>()

const value = defineModel<TabsValue>('value', { default: 0 })
</script>

<template>
  <Tabs.Root v-model:value="value" @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab :value="0">Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0">Panel 0</Tabs.Panel>
    <Tabs.Panel :value="1">Panel 1</Tabs.Panel>
  </Tabs.Root>
</template>

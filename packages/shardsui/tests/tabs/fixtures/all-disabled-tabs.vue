<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange } = defineProps<{ onValueChange?: (value: TabsValue | undefined) => void }>()
</script>

<template>
  <Tabs.Root @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab :value="0" disabled>Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1" disabled>Tab 2</Tabs.Tab>
      <Tabs.Tab :value="2" disabled>Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted>Panel 1</Tabs.Panel>
    <Tabs.Panel :value="1" keep-mounted>Panel 2</Tabs.Panel>
    <Tabs.Panel :value="2" keep-mounted>Panel 3</Tabs.Panel>
  </Tabs.Root>
</template>

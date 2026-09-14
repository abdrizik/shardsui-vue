<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { allowChange = false, onValueChange } = defineProps<{
  allowChange?: boolean
  onValueChange?: (value: TabsValue | undefined) => void
}>()

const value = defineModel<TabsValue>('value', { default: 0 })

function handleValueChange(next: TabsValue | undefined) {
  onValueChange?.(next)
  if (allowChange && next !== undefined) value.value = next
}
</script>

<template>
  <Tabs.Root :value="value" data-testid="root" @update:value="handleValueChange">
    <Tabs.List>
      <Tabs.Tab :value="0">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 2</Tabs.Tab>
      <Tabs.Tab :value="2">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted>Panel 1</Tabs.Panel>
    <Tabs.Panel :value="1" keep-mounted>Panel 2</Tabs.Panel>
    <Tabs.Panel :value="2" keep-mounted>Panel 3</Tabs.Panel>
  </Tabs.Root>
</template>

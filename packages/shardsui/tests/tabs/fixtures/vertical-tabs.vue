<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange, activateOnFocus = false } = defineProps<{
  onValueChange?: (value: TabsValue | undefined) => void
  activateOnFocus?: boolean
}>()

const value = defineModel<TabsValue>('value', { default: 0 })
</script>

<template>
  <Tabs.Root
    v-model:value="value"
    orientation="vertical"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Tabs.List :activate-on-focus="activateOnFocus">
      <Tabs.Tab :value="0" style="display: block">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1" style="display: block">Tab 2</Tabs.Tab>
      <Tabs.Tab :value="2" style="display: block">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted>Panel 1</Tabs.Panel>
    <Tabs.Panel :value="1" keep-mounted>Panel 2</Tabs.Panel>
    <Tabs.Panel :value="2" keep-mounted>Panel 3</Tabs.Panel>
  </Tabs.Root>
</template>

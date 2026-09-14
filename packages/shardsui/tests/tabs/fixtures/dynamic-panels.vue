<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange, disableFirst = false } = defineProps<{
  onValueChange?: (value: TabsValue | undefined) => void
  disableFirst?: boolean
}>()

const value = defineModel<TabsValue>('value')
</script>

<template>
  <Tabs.Root
    v-model:value="value"
    data-testid="root"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Tabs.List>
      <Tabs.Tab :value="0" :disabled="disableFirst">Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted>Panel 0</Tabs.Panel>
    <Tabs.Panel :value="1" keep-mounted>Panel 1</Tabs.Panel>
  </Tabs.Root>
</template>

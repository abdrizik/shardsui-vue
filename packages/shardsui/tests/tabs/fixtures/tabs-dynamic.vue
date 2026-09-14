<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const {
  onValueChange,
  disableFirst = false,
  showFirst = true
} = defineProps<{
  onValueChange?: (value: TabsValue | undefined) => void
  disableFirst?: boolean
  showFirst?: boolean
}>()

const value = defineModel<TabsValue>('value')
</script>

<template>
  <Tabs.Root v-model:value="value" @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab v-if="showFirst" :value="0" :disabled="disableFirst">Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="2">Tab 2</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

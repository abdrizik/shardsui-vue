<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange, showTab = true } = defineProps<{
  onValueChange?: (value: TabsValue | undefined) => void
  showTab?: boolean
}>()

const value = defineModel<TabsValue>('value')
</script>

<template>
  <Tabs.Root v-model:value="value" @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab v-if="showTab" :value="0">Tab 0</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted>Panel 0</Tabs.Panel>
  </Tabs.Root>
</template>

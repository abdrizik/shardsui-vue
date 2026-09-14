<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange } = defineProps<{ onValueChange?: (value: TabsValue | undefined) => void }>()

const value = defineModel<TabsValue>('value', { default: null })
</script>

<template>
  <Tabs.Root v-model:value="value" @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab :value="0">Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

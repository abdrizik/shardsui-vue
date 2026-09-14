<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange } = defineProps<{ onValueChange?: (value: TabsValue | undefined) => void }>()
</script>

<template>
  <Tabs.Root @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="2">Tab 2</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

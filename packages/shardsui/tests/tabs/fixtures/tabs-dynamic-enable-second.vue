<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange, enableSecond = false } = defineProps<{
  onValueChange?: (value: TabsValue | undefined) => void
  enableSecond?: boolean
}>()
</script>

<template>
  <Tabs.Root @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab :value="0" disabled>Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1" :disabled="!enableSecond">Tab 1</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

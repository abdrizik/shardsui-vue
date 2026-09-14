<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange } = defineProps<{ onValueChange?: (value: TabsValue | undefined) => void }>()
</script>

<template>
  <Tabs.Root @update:value="(next) => onValueChange?.(next)">
    <Tabs.List>
      <Tabs.Tab value="a" disabled>Stale duplicate</Tabs.Tab>
      <Tabs.Tab value="a">A</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

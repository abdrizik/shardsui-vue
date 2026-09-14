<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const {
  value = 0,
  onValueChange,
  onPointerdown
} = defineProps<{
  value?: TabsValue
  onValueChange?: (value: TabsValue | undefined) => void
  onPointerdown?: (event: PointerEvent) => void
}>()
</script>

<template>
  <Tabs.Root :value="value" @update:value="(next) => onValueChange?.(next)">
    <Tabs.List activate-on-focus>
      <Tabs.Tab :value="0">Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1" @pointerdown="onPointerdown">Tab 1</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

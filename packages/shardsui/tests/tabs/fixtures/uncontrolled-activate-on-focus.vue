<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange, disabledSecond = false } = defineProps<{
  onValueChange?: (value: TabsValue | undefined) => void
  disabledSecond?: boolean
}>()

const value = shallowRef<TabsValue>(0)
</script>

<template>
  <Tabs.Root v-model:value="value" @update:value="(next) => onValueChange?.(next)">
    <Tabs.List activate-on-focus>
      <Tabs.Tab :value="0">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1" :disabled="disabledSecond">Tab 2</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

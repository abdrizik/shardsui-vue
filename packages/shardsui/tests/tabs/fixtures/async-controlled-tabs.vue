<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tabs, type TabsValue } from '@/components/tabs'

const { activateOnFocus = false, onValueChange } = defineProps<{
  activateOnFocus?: boolean
  onValueChange?: (value: TabsValue | undefined) => void
}>()

const value = shallowRef<TabsValue>(0)

function handleValueChange(next: TabsValue | undefined) {
  onValueChange?.(next)
  Promise.resolve().then(() => {
    if (next !== undefined) value.value = next
  })
}
</script>

<template>
  <Tabs.Root :value="value" @update:value="handleValueChange">
    <Tabs.List :activate-on-focus="activateOnFocus">
      <Tabs.Tab :value="0">First</Tabs.Tab>
      <Tabs.Tab :value="1" disabled>Disabled</Tabs.Tab>
      <Tabs.Tab :value="2">Third</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

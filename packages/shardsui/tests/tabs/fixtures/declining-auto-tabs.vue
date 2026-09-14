<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tabs, type TabsValue } from '@/components/tabs'

const { onValueChange } = defineProps<{ onValueChange?: (value: TabsValue | undefined) => void }>()

const value = shallowRef<TabsValue | undefined>(undefined)

function decline(next: TabsValue | undefined) {
  onValueChange?.(next)
}
</script>

<template>
  <Tabs.Root :value="value" data-testid="root" @update:value="decline">
    <Tabs.List>
      <Tabs.Tab :value="0" disabled>Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

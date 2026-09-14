<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const { value = 0 } = defineProps<{ value?: number | null }>()
</script>

<template>
  <Tabs.Root :value="value" data-testid="root">
    <Tabs.List>
      <Tabs.Tab :value="0">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 2</Tabs.Tab>
      <Tabs.Indicator data-testid="indicator" />
    </Tabs.List>
  </Tabs.Root>
</template>

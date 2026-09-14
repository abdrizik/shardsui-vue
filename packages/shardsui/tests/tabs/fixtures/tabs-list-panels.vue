<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const { loopFocus = true } = defineProps<{ loopFocus?: boolean }>()
</script>

<template>
  <Tabs.Root>
    <Tabs.List :loop-focus="loopFocus">
      <Tabs.Tab :value="0" data-testid="tab-0">Tab 1</Tabs.Tab>
      <Tabs.Tab :value="1" data-testid="tab-1">Tab 2</Tabs.Tab>
      <Tabs.Tab :value="2" data-testid="tab-2">Tab 3</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted data-testid="panel-0">Panel 1</Tabs.Panel>
    <Tabs.Panel :value="1" keep-mounted data-testid="panel-1">Panel 2</Tabs.Panel>
    <Tabs.Panel :value="2" keep-mounted id="custom-panel-id" data-testid="panel-2"
      >Panel 3</Tabs.Panel
    >
  </Tabs.Root>
</template>

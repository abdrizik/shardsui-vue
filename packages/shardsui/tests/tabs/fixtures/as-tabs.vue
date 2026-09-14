<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const { rootAs, listAs, tabAs, panelAs, indicatorAs } = defineProps<{
  rootAs?: keyof HTMLElementTagNameMap
  listAs?: keyof HTMLElementTagNameMap
  tabAs?: keyof HTMLElementTagNameMap
  panelAs?: keyof HTMLElementTagNameMap
  indicatorAs?: keyof HTMLElementTagNameMap
}>()
</script>

<template>
  <Tabs.Root :as="rootAs" :value="0" data-testid="root">
    <Tabs.List :as="listAs" data-testid="list">
      <Tabs.Tab :as="tabAs" :value="0" data-testid="tab">One</Tabs.Tab>
      <Tabs.Indicator :as="indicatorAs" data-testid="indicator" />
    </Tabs.List>
    <Tabs.Panel :as="panelAs" :value="0" data-testid="panel">Panel One</Tabs.Panel>
  </Tabs.Root>
</template>

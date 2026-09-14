<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const {
  rootStyle,
  listStyle,
  tabStyle,
  firstTabStyle,
  firstTabAs = 'button'
} = defineProps<{
  rootStyle?: string
  listStyle?: string
  tabStyle?: string
  firstTabStyle?: string
  firstTabAs?: 'button' | 'a'
}>()

const value = defineModel<TabsValue>('value', { default: 2 })
</script>

<template>
  <Tabs.Root v-model:value="value" :style="rootStyle">
    <Tabs.List data-testid="tab-list" :style="listStyle">
      <Tabs.Tab
        :as="firstTabAs"
        :value="1"
        data-testid="first-tab"
        :style="firstTabStyle ?? tabStyle"
      >
        One
      </Tabs.Tab>
      <Tabs.Tab :value="2" :style="tabStyle">Two</Tabs.Tab>
      <Tabs.Tab :value="3" :style="tabStyle">Three</Tabs.Tab>
      <Tabs.Indicator data-testid="bubble" />
    </Tabs.List>
  </Tabs.Root>
</template>

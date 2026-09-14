<script setup lang="ts">
import { shallowRef } from 'vue'
import { Tabs, type TabsValue } from '@/components/tabs'

const value = shallowRef<TabsValue>('overview')
</script>

<template>
  <Tabs.Root v-model:value="value">
    <Tabs.List>
      <Tabs.Tab as="a" value="overview" href="#overview">Overview</Tabs.Tab>
      <Tabs.Tab as="a" value="details" href="#details">Details</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

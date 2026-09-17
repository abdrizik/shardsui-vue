<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'
import ButtonStub from '../../stubs/button.vue'

const value = defineModel<TabsValue>('value', { default: 'overview' })
</script>

<template>
  <Tabs.Root v-model:value="value">
    <Tabs.List>
      <Tabs.Tab :as="ButtonStub" value="overview" data-testid="overview">Overview</Tabs.Tab>
      <Tabs.Tab :as="ButtonStub" value="details" data-testid="details">Details</Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

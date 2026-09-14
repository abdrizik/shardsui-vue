<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const { insertedTabWidth = null } = defineProps<{ insertedTabWidth?: number | null }>()
</script>

<template>
  <Tabs.Root :value="2">
    <Tabs.List data-testid="tab-list" style="width: 320px; display: flex; overflow: hidden">
      <Tabs.Tab
        v-if="insertedTabWidth != null"
        :value="0"
        data-testid="inserted-tab"
        :style="`width: ${insertedTabWidth}px; flex-shrink: 0`"
      >
        Inserted
      </Tabs.Tab>
      <Tabs.Tab :value="1" style="width: 100px; flex-shrink: 0">One</Tabs.Tab>
      <Tabs.Tab :value="2" style="width: 100px; flex-shrink: 0">Two</Tabs.Tab>
      <Tabs.Indicator data-testid="bubble" />
    </Tabs.List>
  </Tabs.Root>
</template>

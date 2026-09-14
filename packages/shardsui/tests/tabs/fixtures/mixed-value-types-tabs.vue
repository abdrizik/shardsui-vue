<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const tabValues: TabsValue[] = [0, '0', 1, '1']
</script>

<template>
  <Tabs.Root>
    <Tabs.List>
      <Tabs.Tab
        v-for="value in tabValues"
        :key="String(typeof value) + String(value)"
        :value="value"
      >
        Tab {{ typeof value }} {{ value }}
      </Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel
      v-for="value in tabValues"
      :key="String(typeof value) + String(value)"
      :value="value"
      keep-mounted
    >
      Panel {{ typeof value }} {{ value }}
    </Tabs.Panel>
  </Tabs.Root>
</template>

<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const { ariaLabel, ariaLabelledby } = defineProps<{ ariaLabel?: string; ariaLabelledby?: string }>()
</script>

<template>
  <h3 v-if="ariaLabelledby" :id="ariaLabelledby">complex name</h3>
  <Tabs.Root>
    <Tabs.List :aria-label="ariaLabel" :aria-labelledby="ariaLabelledby">
      <Tabs.Tab :value="0">Tab 0</Tabs.Tab>
      <Tabs.Tab :value="1">Tab 1</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel :value="0" keep-mounted>Panel 0</Tabs.Panel>
    <Tabs.Panel :value="1" keep-mounted>Panel 1</Tabs.Panel>
  </Tabs.Root>
</template>

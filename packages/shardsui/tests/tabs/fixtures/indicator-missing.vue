<script setup lang="ts">
import { Tabs } from '@/components/tabs'
</script>

<template>
  <Tabs.Root value="missing">
    <Tabs.List>
      <Tabs.Tab value="one">One</Tabs.Tab>
      <Tabs.Indicator v-slot="state" data-testid="bubble">
        <span
          data-testid="indicator-state"
          :data-active-tab-position="state.activeTabPosition === null ? 'null' : 'set'"
          :data-active-tab-size="state.activeTabSize === null ? 'null' : 'set'"
        ></span>
      </Tabs.Indicator>
    </Tabs.List>
  </Tabs.Root>
</template>

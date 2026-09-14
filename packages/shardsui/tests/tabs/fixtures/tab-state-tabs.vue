<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const { value = 0 } = defineProps<{ value?: TabsValue }>()
</script>

<template>
  <Tabs.Root :value="value">
    <Tabs.List>
      <Tabs.Tab v-slot="state" :value="0">
        <span
          data-testid="tab-state-0"
          :data-active="state.active"
          :data-direction="state.activationDirection"
        ></span>
      </Tabs.Tab>
      <Tabs.Tab v-slot="state" :value="1">
        <span
          data-testid="tab-state-1"
          :data-active="state.active"
          :data-direction="state.activationDirection"
        ></span>
      </Tabs.Tab>
    </Tabs.List>
  </Tabs.Root>
</template>

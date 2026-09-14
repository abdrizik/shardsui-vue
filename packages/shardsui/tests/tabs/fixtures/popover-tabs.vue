<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'
import { Tabs } from '@/components/tabs'

const value = shallowRef('overview')
</script>

<template>
  <Popover.Root>
    <Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner :side-offset="8">
        <Popover.Popup>
          <Tabs.Root v-model:value="value">
            <Tabs.List>
              <Tabs.Tab value="overview">Overview</Tabs.Tab>
              <Tabs.Tab value="projects">Projects</Tabs.Tab>
              <Tabs.Tab value="account">Account</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="overview" />
            <Tabs.Panel value="projects" />
            <Tabs.Panel value="account" />
          </Tabs.Root>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

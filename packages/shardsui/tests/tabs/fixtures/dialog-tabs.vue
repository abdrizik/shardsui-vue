<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'
import { Tabs } from '@/components/tabs'

const value = shallowRef('overview')
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger data-testid="trigger">Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
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
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>

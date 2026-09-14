<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const { shadowedMounted = true } = defineProps<{ shadowedMounted?: boolean }>()
</script>

<template>
  <Tabs.Root value="a">
    <Tabs.List>
      <Tabs.Tab value="a">A</Tabs.Tab>
      <Tabs.Tab value="b">B</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel v-if="shadowedMounted" value="b" keep-mounted data-testid="shadowed"
      >Shadowed</Tabs.Panel
    >
    <Tabs.Panel value="b" keep-mounted data-testid="owner">Owner</Tabs.Panel>
  </Tabs.Root>
</template>

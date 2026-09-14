<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const { panelId, triggerId } = defineProps<{ panelId?: string; triggerId?: string }>()
</script>

<template>
  <Collapsible.Root open>
    <Collapsible.Trigger :id="triggerId">Trigger</Collapsible.Trigger>
    <Collapsible.Panel :id="panelId" data-testid="panel">This is panel content</Collapsible.Panel>
  </Collapsible.Root>
</template>

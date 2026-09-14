<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'
</script>

<template>
  <Collapsible.Root v-slot="{ open }" data-testid="root">
    <Collapsible.Trigger v-slot="{ open: triggerOpen }">
      <span data-testid="trigger-state">{{ triggerOpen ? 'open' : 'closed' }}</span>
    </Collapsible.Trigger>
    <Collapsible.Panel v-slot="{ open: panelOpen }" keep-mounted data-testid="panel">
      <span data-testid="panel-state">{{ panelOpen ? 'open' : 'closed' }}</span>
    </Collapsible.Panel>
    <span data-testid="root-state">{{ open ? 'open' : 'closed' }}</span>
  </Collapsible.Root>
</template>

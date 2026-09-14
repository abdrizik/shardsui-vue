<script setup lang="ts">
import { Accordion } from '@/components/accordion'
import { Collapsible } from '@/components/collapsible'
</script>

<template>
  <Accordion.Root>
    <Accordion.Item value="one">
      <Accordion.Header>
        <Collapsible.Trigger>Trigger</Collapsible.Trigger>
      </Accordion.Header>
      <Collapsible.Panel data-testid="panel">Panel contents</Collapsible.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

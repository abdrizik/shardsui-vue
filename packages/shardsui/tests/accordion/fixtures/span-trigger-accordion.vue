<script setup lang="ts">
import { Accordion } from '@/components/accordion'
</script>

<template>
  <Accordion.Root>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.Trigger as="span">Trigger</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const { value = [] } = defineProps<{ value?: unknown[] }>()
</script>

<template>
  <Accordion.Root :value="value" keep-mounted>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 2</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

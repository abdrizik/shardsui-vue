<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const { value = [] } = defineProps<{ value?: unknown[] }>()
</script>

<template>
  <Accordion.Root :value="value">
    <Accordion.Item :value="0">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 1</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

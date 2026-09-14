<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const { parts = 'both' } = defineProps<{ parts?: 'both' | 'trigger' | 'panel' }>()
</script>

<template>
  <Accordion.Root :value="[0]">
    <Accordion.Item :value="0">
      <Accordion.Header>
        <Accordion.Trigger v-if="parts !== 'panel'">Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel v-if="parts !== 'trigger'">Panel contents 1</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

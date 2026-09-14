<script setup lang="ts">
import { shallowRef } from 'vue'
import { Accordion } from '@/components/accordion'

const { initialTriggerId } = defineProps<{ initialTriggerId?: string }>()

const triggerId = shallowRef<string | undefined>(initialTriggerId)
</script>

<template>
  <button type="button" @click="triggerId = 'custom-trigger-id-1'">Set id 1</button>
  <button type="button" @click="triggerId = 'custom-trigger-id-2'">Set id 2</button>
  <button type="button" @click="triggerId = undefined">Remove id</button>

  <Accordion.Root :value="[0]">
    <Accordion.Item :value="0">
      <Accordion.Header>
        <Accordion.Trigger :id="triggerId">Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel contents 1</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

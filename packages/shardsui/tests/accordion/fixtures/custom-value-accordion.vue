<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const {
  multiple = false,
  onValueChange,
  itemValues = ['one', 'two']
} = defineProps<{
  multiple?: boolean
  onValueChange?: (value: unknown[]) => void
  itemValues?: unknown[]
}>()

const value = defineModel<unknown[]>('value', { default: () => [] })
</script>

<template>
  <Accordion.Root
    v-model:value="value"
    :multiple="multiple"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Accordion.Item :value="itemValues[0]">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel contents 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item :value="itemValues[1]">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel contents 2</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

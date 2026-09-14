<script setup lang="ts">
import { shallowRef } from 'vue'
import { Accordion } from '@/components/accordion'

const {
  value: initialValue = [],
  multiple = false,
  allowChange = false,
  onValueChange
} = defineProps<{
  value?: unknown[]
  multiple?: boolean
  allowChange?: boolean
  onValueChange?: (value: unknown[]) => void
}>()

const value = shallowRef(initialValue)

function handleValueChange(next: unknown[]) {
  if (allowChange) value.value = next
  onValueChange?.(next)
}
</script>

<template>
  <Accordion.Root :value="value" :multiple="multiple" @update:value="handleValueChange">
    <Accordion.Item value="one">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item value="two">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 2</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

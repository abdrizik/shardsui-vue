<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const {
  multiple = false,
  disabled = false,
  itemDisabled = false,
  onValueChange,
  keepMounted = false
} = defineProps<{
  multiple?: boolean
  disabled?: boolean
  itemDisabled?: boolean
  onValueChange?: (value: unknown[]) => void
  keepMounted?: boolean
}>()

const value = defineModel<unknown[]>('value', { default: () => [] })
</script>

<template>
  <Accordion.Root
    v-model:value="value"
    :multiple="multiple"
    :disabled="disabled"
    :keep-mounted="keepMounted"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Accordion.Item data-testid="item1" :disabled="itemDisabled">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item data-testid="item2">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 2</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

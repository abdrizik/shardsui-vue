<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const {
  onOpenChange,
  onValueChange,
  as = 'button'
} = defineProps<{
  onOpenChange?: (open: boolean) => void
  onValueChange?: (value: unknown[]) => void
  as?: keyof HTMLElementTagNameMap
}>()

const value = defineModel<unknown[]>('value', { default: () => [] })
</script>

<template>
  <Accordion.Root v-model:value="value" @update:value="(next) => onValueChange?.(next)">
    <Accordion.Item @open-change="(open) => onOpenChange?.(open)">
      <Accordion.Header>
        <Accordion.Trigger :as="as">Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel contents 1</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

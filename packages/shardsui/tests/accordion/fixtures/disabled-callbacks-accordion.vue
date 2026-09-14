<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const { disabledPart, onValueChange, onOpenChange, onClick } = defineProps<{
  disabledPart: 'root' | 'item'
  onValueChange?: (value: unknown[]) => void
  onOpenChange?: (open: boolean) => void
  onClick?: (event: MouseEvent) => void
}>()
</script>

<template>
  <Accordion.Root
    :disabled="disabledPart === 'root'"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Accordion.Item
      :value="0"
      :disabled="disabledPart === 'item'"
      @open-change="(open) => onOpenChange?.(open)"
    >
      <Accordion.Header>
        <Accordion.Trigger :disabled="false" @click="onClick">Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item :value="1" @open-change="(open) => onOpenChange?.(open)">
      <Accordion.Header>
        <Accordion.Trigger :disabled="false" @click="onClick">Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel 2</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

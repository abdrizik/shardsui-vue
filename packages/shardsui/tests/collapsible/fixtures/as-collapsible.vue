<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const {
  rootAs = 'div',
  triggerAs = 'button',
  panelAs = 'div'
} = defineProps<{
  rootAs?: keyof HTMLElementTagNameMap
  triggerAs?: keyof HTMLElementTagNameMap
  panelAs?: keyof HTMLElementTagNameMap
}>()
</script>

<template>
  <Collapsible.Root :as="rootAs" open data-testid="root">
    <Collapsible.Trigger :as="triggerAs" data-testid="trigger">Trigger</Collapsible.Trigger>
    <Collapsible.Panel :as="panelAs" data-testid="panel">This is panel content</Collapsible.Panel>
  </Collapsible.Root>
</template>

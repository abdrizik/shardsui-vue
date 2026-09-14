<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const { open = false, onOpenChange } = defineProps<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Collapsible.Root :open="open" @update:open="(next) => onOpenChange?.(next)">
    <Collapsible.Trigger>Trigger</Collapsible.Trigger>
    <Collapsible.Panel>This is panel content</Collapsible.Panel>
  </Collapsible.Root>
</template>

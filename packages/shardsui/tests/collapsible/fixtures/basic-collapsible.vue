<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const {
  onOpenChange,
  disabled = false,
  onTriggerClick
} = defineProps<{
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  onTriggerClick?: (event: MouseEvent) => void
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Collapsible.Root
    v-model:open="open"
    :disabled="disabled"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <Collapsible.Trigger @click="onTriggerClick">Trigger</Collapsible.Trigger>
    <Collapsible.Panel>This is panel content</Collapsible.Panel>
  </Collapsible.Root>
</template>

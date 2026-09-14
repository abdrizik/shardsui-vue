<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const { onOpenChange } = defineProps<{ onOpenChange?: (open: boolean) => void }>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Collapsible.Root v-model:open="open" @update:open="(next) => onOpenChange?.(next)">
    <Collapsible.Trigger>Trigger</Collapsible.Trigger>
    <Collapsible.Panel hidden-until-found data-testid="panel"
      >This is panel content</Collapsible.Panel
    >
  </Collapsible.Root>
</template>

<script setup lang="ts">
import { shallowRef } from 'vue'
import { Collapsible } from '@/components/collapsible'

const { keepMounted = false, onOpenChange } = defineProps<{
  keepMounted?: boolean
  onOpenChange?: (open: boolean) => void
}>()

const open = shallowRef(false)

function handleOpenChange(next: boolean) {
  open.value = next
  onOpenChange?.(next)
}
</script>

<template>
  <Collapsible.Root :open="open" @update:open="handleOpenChange">
    <Collapsible.Trigger>Trigger</Collapsible.Trigger>
    <Collapsible.Panel :keep-mounted="keepMounted" data-testid="panel">
      This is panel content
    </Collapsible.Panel>
  </Collapsible.Root>

  <button type="button" @click="open = !open">toggle externally</button>
</template>

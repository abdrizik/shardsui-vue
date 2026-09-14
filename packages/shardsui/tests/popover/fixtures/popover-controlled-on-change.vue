<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const { onSeen } = defineProps<{ onSeen: (value: boolean) => void }>()

const open = shallowRef(false)

function handleOpenChange(next: boolean) {
  onSeen(open.value)
  open.value = next
}
</script>

<template>
  <Popover.Root :open="open" @update:open="handleOpenChange">
    <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

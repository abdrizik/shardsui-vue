<script setup lang="ts">
import { Popover } from '@/components/popover'

const { disabled = false } = defineProps<{ disabled?: boolean }>()
</script>

<template>
  <Popover.Root>
    <Popover.Trigger data-testid="trigger" :disabled="disabled">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

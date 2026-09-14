<script setup lang="ts">
import { Popover } from '@/components/popover'

const { disabled = true } = defineProps<{ disabled?: boolean }>()
</script>

<template>
  <Popover.Root>
    <Popover.Trigger data-testid="trigger" as="span" :disabled="disabled">Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

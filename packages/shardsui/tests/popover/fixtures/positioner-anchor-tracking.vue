<script setup lang="ts">
import { Popover } from '@/components/popover'

const { top = 0, keepMounted = false } = defineProps<{ top?: number; keepMounted?: boolean }>()
</script>

<template>
  <Popover.Root open>
    <Popover.Trigger
      data-testid="trigger"
      :style="{ width: '100px', height: '100px', position: 'relative', top: `${top}px` }"
    >
      Trigger
    </Popover.Trigger>
    <Popover.Portal :keep-mounted="keepMounted">
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popup" style="width: 100px; height: 100px">Popup</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

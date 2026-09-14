<script setup lang="ts">
import { Popover } from '@/components/popover'

const { delay = 0, openOnHover = true } = defineProps<{ delay?: number; openOnHover?: boolean }>()
</script>

<template>
  <Popover.Root>
    <Popover.Trigger data-testid="trigger" :open-on-hover="openOnHover" :delay="delay"
      >Open</Popover.Trigger
    >
    <Popover.Portal>
      <Popover.Backdrop data-testid="backdrop" />
      <Popover.Positioner data-testid="positioner">
        <Popover.Popup data-testid="popover-popup">Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

<script setup lang="ts">
import { Popover } from '@/components/popover'

const { onOpenChangeComplete } = defineProps<{ onOpenChangeComplete?: (open: boolean) => void }>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Popover.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Popover.Trigger>Toggle</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">
          <Popover.Close>Close</Popover.Close>
          Content
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

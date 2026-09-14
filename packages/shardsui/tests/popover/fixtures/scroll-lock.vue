<script setup lang="ts">
import { Popover } from '@/components/popover'

const { wide = true } = defineProps<{ wide?: boolean }>()
</script>

<template>
  <Popover.Root modal>
    <Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner
        data-testid="positioner"
        :style="wide ? 'width: calc(100vw - 10px)' : 'width: 240px'"
      >
        <Popover.Popup>Content</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>

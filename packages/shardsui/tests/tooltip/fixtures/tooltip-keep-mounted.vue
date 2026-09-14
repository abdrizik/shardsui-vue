<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const { keepMounted = false } = defineProps<{ keepMounted?: boolean }>()
</script>

<template>
  <Tooltip.Root>
    <Tooltip.Trigger>Trigger</Tooltip.Trigger>
    <Tooltip.Portal :keep-mounted="keepMounted">
      <Tooltip.Positioner>
        <Tooltip.Popup data-testid="popup">Content</Tooltip.Popup>
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>

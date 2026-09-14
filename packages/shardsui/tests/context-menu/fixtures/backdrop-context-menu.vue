<script setup lang="ts">
import { ContextMenu } from '@/components/context-menu'
</script>

<template>
  <ContextMenu.Root :open="true">
    <ContextMenu.Trigger data-testid="trigger">Right-click me</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Backdrop data-testid="backdrop" />
      <ContextMenu.Positioner>
        <ContextMenu.Popup />
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</template>

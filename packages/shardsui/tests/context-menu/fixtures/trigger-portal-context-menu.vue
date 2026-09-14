<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { ContextMenu } from '@/components/context-menu'

const container = useTemplateRef<HTMLElement>('container')
</script>

<template>
  <ContextMenu.Root :open="true">
    <ContextMenu.Trigger data-testid="trigger">
      Right-click me
      <div ref="container"></div>
    </ContextMenu.Trigger>
    <ContextMenu.Portal :container="container">
      <ContextMenu.Positioner>
        <ContextMenu.Popup data-testid="popup" />
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</template>

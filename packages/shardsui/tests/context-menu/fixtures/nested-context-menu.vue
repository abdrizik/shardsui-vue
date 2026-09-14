<script setup lang="ts">
import { ContextMenu } from '@/components/context-menu'
</script>

<template>
  <ContextMenu.Root>
    <ContextMenu.Trigger data-testid="outer-trigger">
      outer
      <ContextMenu.Root>
        <ContextMenu.Trigger data-testid="inner-trigger">inner</ContextMenu.Trigger>
        <ContextMenu.Portal>
          <ContextMenu.Positioner>
            <ContextMenu.Popup data-testid="inner-menu" />
          </ContextMenu.Positioner>
        </ContextMenu.Portal>
      </ContextMenu.Root>
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner>
        <ContextMenu.Popup data-testid="outer-menu" />
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</template>

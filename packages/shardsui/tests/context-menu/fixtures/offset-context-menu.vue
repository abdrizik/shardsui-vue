<script setup lang="ts">
import { ContextMenu } from '@/components/context-menu'
import type { Align, Side } from '@/internal/floating/anchor-positioning'

const {
  onOpenChange,
  disabled = false,
  side = undefined,
  align = undefined,
  sideOffset = undefined,
  alignOffset = undefined
} = defineProps<{
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
  side?: Side
  align?: Align
  sideOffset?: number
  alignOffset?: number
}>()
</script>

<template>
  <ContextMenu.Root :disabled="disabled" @update:open="(value) => onOpenChange?.(value)">
    <ContextMenu.Trigger data-testid="context-trigger">Surface</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner
        data-testid="context-positioner"
        :side="side"
        :align="align"
        :side-offset="sideOffset"
        :align-offset="alignOffset"
      >
        <ContextMenu.Popup data-testid="context-popup">
          <ContextMenu.Item data-testid="context-item">Action</ContextMenu.Item>
        </ContextMenu.Popup>
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</template>

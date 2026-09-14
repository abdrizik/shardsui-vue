<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onDisabledItemClick, onDisabledItemKeyDown, onDisabledItemKeyUp } = defineProps<{
  onDisabledItemClick?: (event: MouseEvent) => void
  onDisabledItemKeyDown?: (event: KeyboardEvent) => void
  onDisabledItemKeyUp?: (event: KeyboardEvent) => void
}>()
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
          <Menu.Item
            data-testid="item-2"
            disabled
            @click="(event) => onDisabledItemClick?.(event)"
            @keydown="(event) => onDisabledItemKeyDown?.(event)"
            @keyup="(event) => onDisabledItemKeyUp?.(event)"
          >
            Item 2 (disabled)
          </Menu.Item>
          <Menu.Item data-testid="item-3">Item 3</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

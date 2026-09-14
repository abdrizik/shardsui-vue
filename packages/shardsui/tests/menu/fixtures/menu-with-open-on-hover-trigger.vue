<script setup lang="ts">
import { Menu } from '@/components/menu'

const {
  openOnHover = true,
  delay = 0,
  closeDelay = 0,
  highlightItemOnHover = true,
  modal = false
} = defineProps<{
  openOnHover?: boolean
  delay?: number
  closeDelay?: number
  highlightItemOnHover?: boolean
  modal?: boolean
}>()
</script>

<template>
  <Menu.Root :highlight-item-on-hover="highlightItemOnHover" :modal="modal">
    <Menu.Trigger :open-on-hover="openOnHover" :delay="delay" :close-delay="closeDelay">
      Toggle
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu-positioner">
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
          <Menu.Item data-testid="item-2">Item 2</Menu.Item>
          <Menu.Item data-testid="item-3">Item 3</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

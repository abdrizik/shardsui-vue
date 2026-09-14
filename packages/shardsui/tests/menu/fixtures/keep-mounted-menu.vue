<script setup lang="ts">
import { Menu } from '@/components/menu'
</script>

<template>
  <Menu.Root :modal="false">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal keep-mounted>
      <Menu.Positioner data-testid="menu-positioner">
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
          <Menu.Item data-testid="item-2">Item 2</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

<script setup lang="ts">
import { Menu } from '@/components/menu'
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item data-testid="item-1">Aa</Menu.Item>
          <Menu.Item data-testid="item-2">Ba</Menu.Item>
          <Menu.Item data-testid="item-3">Bb</Menu.Item>
          <Menu.Item data-testid="item-4">Ca</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

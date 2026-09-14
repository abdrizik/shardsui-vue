<script setup lang="ts">
import { Menu } from '@/components/menu'

const { modal = true } = defineProps<{
  modal?: boolean
}>()
</script>

<template>
  <div>
    <input data-testid="before" />
    <Menu.Root :modal="modal">
      <Menu.Trigger>Toggle</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner data-testid="menu-positioner">
          <Menu.Popup data-testid="menu">
            <Menu.Item data-testid="item-1">Item 1</Menu.Item>
            <Menu.Item data-testid="item-2">Item 2</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <input data-testid="after" />
  </div>
</template>

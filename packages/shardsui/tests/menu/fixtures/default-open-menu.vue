<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const open = shallowRef(true)
</script>

<template>
  <Menu.Root v-model:open="open">
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
</template>

<script setup lang="ts">
import { Menu } from '@/components/menu'

const { width = 'calc(100vw - 10px)' } = defineProps<{ width?: string }>()
</script>

<template>
  <Menu.Root modal>
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu-positioner" :style="{ width }">
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

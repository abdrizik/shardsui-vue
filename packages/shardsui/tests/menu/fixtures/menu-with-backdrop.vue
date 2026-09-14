<script setup lang="ts">
import { Menu } from '@/components/menu'

const { openOnHover = false, delay = 0 } = defineProps<{
  openOnHover?: boolean
  delay?: number
}>()
</script>

<template>
  <Menu.Root>
    <Menu.Trigger :open-on-hover="openOnHover" :delay="delay">Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Backdrop data-testid="backdrop" />
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

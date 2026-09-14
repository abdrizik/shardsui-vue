<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const open = shallowRef(false)

function setOpen(next: boolean) {
  if (!next) open.value = false
}
</script>

<template>
  <Menu.Root :open="open" @update:open="setOpen">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item>Item</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

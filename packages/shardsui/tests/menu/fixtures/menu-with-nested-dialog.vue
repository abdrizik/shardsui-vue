<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { Menu } from '@/components/menu'
</script>

<template>
  <Menu.Root>
    <Menu.Trigger data-testid="menu-trigger">Open Menu</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu-popup">
          <Menu.Item>Item 1</Menu.Item>
          <Dialog.Root>
            <Menu.Item :close-on-click="false">
              <Dialog.Trigger data-testid="dialog-trigger">Open Dialog</Dialog.Trigger>
            </Menu.Item>
            <Dialog.Portal>
              <Dialog.Popup data-testid="dialog-popup">
                <button type="button" data-testid="dialog-button">Dialog Button</button>
              </Dialog.Popup>
            </Dialog.Portal>
          </Dialog.Root>
          <Menu.Item>Item 2</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

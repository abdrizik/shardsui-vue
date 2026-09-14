<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'
</script>

<template>
  <Menubar style="display: flex">
    <Menu.Root>
      <Menu.Trigger disabled data-testid="file-trigger">File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Open</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <Menu.Root>
      <Menu.Trigger data-testid="edit-trigger">Edit</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item>Copy</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Menubar>
</template>

<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Toolbar } from '@/components/toolbar'
</script>

<template>
  <Menu.Root>
    <Toolbar.Root>
      <Toolbar.Button :as="Menu.Trigger" data-testid="trigger">Open</Toolbar.Button>
    </Toolbar.Root>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item>Item</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

<script setup lang="ts">
import { Menu } from '@/components/menu'

const { submenu = false } = defineProps<{ submenu?: boolean }>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item>Item 1</Menu.Item>
          <Menu.SubmenuRoot v-if="submenu">
            <Menu.SubmenuTrigger data-testid="submenu-trigger">Item 2</Menu.SubmenuTrigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup data-testid="submenu">
                  <Menu.Item>Nested 2.1</Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
          <Menu.Item v-else data-testid="item-2">Item 2</Menu.Item>
          <Menu.Item>Item 3</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { Menu } from '@/components/menu'
import type { TextDirection } from '@/internal/direction-context'

const { direction = 'ltr' } = defineProps<{ direction?: TextDirection }>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Menu.Root>
      <Menu.Trigger>Toggle</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup data-testid="menu">
            <Menu.Item data-testid="item-1">Item 1</Menu.Item>
            <Menu.SubmenuRoot>
              <Menu.SubmenuTrigger data-testid="submenu-trigger" :open-on-hover="false">
                Item 2
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup data-testid="submenu">
                    <Menu.Item data-testid="submenu-item-1">Item 2.1</Menu.Item>
                    <Menu.Item data-testid="submenu-item-2">Item 2.2</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </DirectionProvider>
</template>

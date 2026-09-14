<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { Menu } from '@/components/menu'
import type { TextDirection } from '@/internal/direction-context'

const { direction = 'ltr', orientation = 'horizontal' } = defineProps<{
  direction?: TextDirection
  orientation?: 'horizontal' | 'vertical'
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Menu.Root open :orientation="orientation">
      <Menu.Trigger>Toggle</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner data-testid="menu-positioner">
          <Menu.Popup data-testid="menu">
            <Menu.Item data-testid="item-1">Item 1</Menu.Item>
            <Menu.SubmenuRoot :orientation="orientation">
              <Menu.SubmenuTrigger data-testid="submenu-trigger">Item 4</Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner>
                  <Menu.Popup data-testid="submenu">
                    <Menu.Item data-testid="item-4_1">Item 4.1</Menu.Item>
                    <Menu.Item data-testid="item-4_2">Item 4.2</Menu.Item>
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

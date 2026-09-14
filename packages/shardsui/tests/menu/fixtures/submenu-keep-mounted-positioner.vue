<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = true } = defineProps<{ open?: boolean }>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger data-testid="submenu-trigger" :delay="0"
              >Item 2</Menu.SubmenuTrigger
            >
            <Menu.Portal keep-mounted>
              <Menu.Positioner data-testid="submenu-positioner">
                <Menu.Popup data-testid="submenu">
                  <Menu.Item>Item 2.1</Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
          <Menu.Item data-testid="item-3">Item 3</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

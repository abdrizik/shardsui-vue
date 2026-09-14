<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'

const { onRootOpenChange, onSubmenuOpenChange, onNextOpenChange } = defineProps<{
  onRootOpenChange?: (open: boolean) => void
  onSubmenuOpenChange?: (open: boolean) => void
  onNextOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Menubar>
    <Menu.Root @update:open="(open) => onRootOpenChange?.(open)">
      <Menu.Trigger data-testid="menubar-file-trigger">File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner data-testid="menubar-file-menu">
          <Menu.Popup>
            <Menu.Item data-testid="menubar-file-item">Item 1</Menu.Item>
            <Menu.SubmenuRoot @update:open="(open) => onSubmenuOpenChange?.(open)">
              <Menu.SubmenuTrigger data-testid="menubar-submenu-trigger">
                Share
              </Menu.SubmenuTrigger>
              <Menu.Portal>
                <Menu.Positioner data-testid="menubar-submenu-menu">
                  <Menu.Popup>
                    <Menu.Item data-testid="menubar-submenu-item">Email</Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.SubmenuRoot>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>

    <Menu.Root @update:open="(open) => onNextOpenChange?.(open)">
      <Menu.Trigger data-testid="menubar-next-trigger">Edit</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner data-testid="menubar-next-menu">
          <Menu.Popup>
            <Menu.Item>Edit Item</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Menubar>
</template>

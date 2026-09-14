<script setup lang="ts">
import { Menu } from '@/components/menu'

const {
  detached = false,
  submenuOpenOnHover = true,
  onSubmenuItemClick
} = defineProps<{
  detached?: boolean
  submenuOpenOnHover?: boolean
  onSubmenuItemClick?: (event: MouseEvent | KeyboardEvent) => void
}>()

const handle = Menu.createHandle()
</script>

<template>
  <template v-if="detached">
    <Menu.Trigger :handle="handle" id="trigger-1">Trigger 1</Menu.Trigger>
    <Menu.Trigger :handle="handle" id="trigger-2">Trigger 2</Menu.Trigger>
  </template>
  <Menu.Root :handle="detached ? handle : undefined">
    <template v-if="!detached">
      <Menu.Trigger id="trigger-1">Trigger 1</Menu.Trigger>
      <Menu.Trigger id="trigger-2">Trigger 2</Menu.Trigger>
    </template>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu">
        <Menu.Popup>
          <Menu.Item>Standalone</Menu.Item>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger data-testid="submenu-trigger" :open-on-hover="submenuOpenOnHover">
              More
            </Menu.SubmenuTrigger>
            <Menu.Portal>
              <Menu.Positioner data-testid="submenu">
                <Menu.Popup>
                  <Menu.Item
                    data-testid="submenu-item"
                    @click="(event) => onSubmenuItemClick?.(event)"
                  >
                    Nested
                  </Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

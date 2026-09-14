<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  open: openProp = true,
  disabled = true,
  onOpenChange,
  onItemClick
} = defineProps<{
  open?: boolean
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
  onItemClick?: (event: MouseEvent) => void
}>()

const open = useOpen(() => openProp, true)
</script>

<template>
  <Menu.Root v-model:open="open" :disabled="disabled" @update:open="(next) => onOpenChange?.(next)">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu-positioner">
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="alpha">Alpha</Menu.Item>
          <Menu.Item data-testid="beta" @click="(event) => onItemClick?.(event)">Beta</Menu.Item>
          <Menu.SubmenuRoot>
            <Menu.SubmenuTrigger data-testid="submenu-trigger" :open-on-hover="false">
              Submenu
            </Menu.SubmenuTrigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup data-testid="submenu-popup">
                  <Menu.Item>Nested item</Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

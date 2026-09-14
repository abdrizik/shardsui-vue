<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  submenuTriggerDisabled = false,
  openOnHover = true,
  closeParentOnEsc = false,
  submenuDelay = 100,
  submenuCloseDelay = undefined,
  triggerOpenOnHover = false,
  triggerDelay = undefined,
  modal = true,
  open: openProp = undefined,
  onOpenChange,
  triggerHtmlId = undefined
} = defineProps<{
  submenuTriggerDisabled?: boolean
  openOnHover?: boolean
  closeParentOnEsc?: boolean
  submenuDelay?: number
  submenuCloseDelay?: number
  triggerOpenOnHover?: boolean
  triggerDelay?: number
  modal?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  triggerHtmlId?: string
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open" :modal="modal" @update:open="(next) => onOpenChange?.(next)">
    <Menu.Trigger :id="triggerHtmlId" :open-on-hover="triggerOpenOnHover" :delay="triggerDelay">
      Toggle
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu-positioner">
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
          <Menu.Item data-testid="item-2">Item 2</Menu.Item>
          <Menu.SubmenuRoot :close-parent-on-esc="closeParentOnEsc">
            <Menu.SubmenuTrigger
              data-testid="submenu-trigger"
              :disabled="submenuTriggerDisabled"
              :open-on-hover="openOnHover"
              :delay="submenuDelay"
              :close-delay="submenuCloseDelay"
            >
              Item 3
            </Menu.SubmenuTrigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup data-testid="submenu">
                  <Menu.Item data-testid="submenu-item-1">Item 3.1</Menu.Item>
                  <Menu.Item data-testid="submenu-item-2">Item 3.2</Menu.Item>
                </Menu.Popup>
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  onItem1Click,
  onItem2Click,
  onOpenChange,
  closeOnClick = true,
  open: openProp = undefined
} = defineProps<{
  onItem1Click?: (event: MouseEvent) => void
  onItem2Click?: (event: MouseEvent) => void
  onOpenChange?: (open: boolean) => void
  closeOnClick?: boolean
  open?: boolean
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open" @update:open="(next) => onOpenChange?.(next)">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu-positioner">
        <Menu.Popup data-testid="menu">
          <Menu.Item
            data-testid="item-1"
            :close-on-click="closeOnClick"
            @click="(event) => onItem1Click?.(event)"
          >
            Item 1
          </Menu.Item>
          <Menu.Item data-testid="item-2" @click="(event) => onItem2Click?.(event)">
            Item 2
          </Menu.Item>
          <Menu.Item data-testid="item-3">Item 3</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

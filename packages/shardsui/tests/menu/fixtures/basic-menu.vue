<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  onOpenChange,
  open: openProp = undefined,
  modal = true,
  triggerDisabled = false,
  triggerOnClick,
  triggerOnMouseDown
} = defineProps<{
  onOpenChange?: (open: boolean) => void
  open?: boolean
  modal?: boolean
  triggerDisabled?: boolean
  triggerOnClick?: (event: MouseEvent) => void
  triggerOnMouseDown?: (event: MouseEvent) => void
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open" :modal="modal" @update:open="(next) => onOpenChange?.(next)">
    <Menu.Trigger
      :disabled="triggerDisabled"
      @click="(event) => triggerOnClick?.(event)"
      @mousedown="(event) => triggerOnMouseDown?.(event)"
    >
      Toggle
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="menu-positioner">
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-1">Item 1</Menu.Item>
          <Menu.Item data-testid="item-2">Item 2</Menu.Item>
          <Menu.Item data-testid="item-3">Item 3</Menu.Item>
          <Menu.Item data-testid="item-4">Item 4</Menu.Item>
          <Menu.Item data-testid="item-5">Item 5</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

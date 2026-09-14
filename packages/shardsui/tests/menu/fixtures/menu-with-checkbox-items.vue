<script setup lang="ts">
import { Menu } from '@/components/menu'

const {
  onCheckedChange,
  closeOnClick = false,
  disabled = false,
  keepMounted = false,
  modal = true
} = defineProps<{
  onCheckedChange?: (checked: boolean) => void
  closeOnClick?: boolean
  disabled?: boolean
  keepMounted?: boolean
  modal?: boolean
}>()

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <Menu.Root :modal="modal">
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal :keep-mounted="keepMounted">
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.CheckboxItem
            v-model:checked="checked"
            :close-on-click="closeOnClick"
            :disabled="disabled"
            data-testid="checkbox-item"
            @update:checked="(next) => onCheckedChange?.(next)"
          >
            Item
          </Menu.CheckboxItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

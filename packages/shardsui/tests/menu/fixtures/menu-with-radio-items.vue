<script setup lang="ts">
import { Menu } from '@/components/menu'

const {
  onValueChange,
  groupDisabled = false,
  closeOnClick = false,
  keepMounted = false,
  modal = true
} = defineProps<{
  onValueChange?: (value: unknown) => void
  groupDisabled?: boolean
  closeOnClick?: boolean
  keepMounted?: boolean
  modal?: boolean
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <Menu.Root :modal="modal">
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal :keep-mounted="keepMounted">
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.RadioGroup
            v-model:value="value"
            :disabled="groupDisabled"
            @update:value="(next) => onValueChange?.(next)"
          >
            <Menu.GroupLabel data-testid="radio-group-label">Sort by</Menu.GroupLabel>
            <Menu.RadioItem value="a" :close-on-click="closeOnClick" data-testid="radio-item-a">
              Option A
            </Menu.RadioItem>
            <Menu.RadioItem value="b" :close-on-click="closeOnClick" data-testid="radio-item-b">
              Option B
            </Menu.RadioItem>
            <Menu.RadioItem value="c" :close-on-click="closeOnClick" data-testid="radio-item-c">
              Option C
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

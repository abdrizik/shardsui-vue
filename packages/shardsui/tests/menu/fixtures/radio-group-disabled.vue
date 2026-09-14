<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onValueChange, onItemClick, onItemKeyDown } = defineProps<{
  onValueChange?: (value: unknown) => void
  onItemClick?: (event: MouseEvent) => void
  onItemKeyDown?: (event: KeyboardEvent) => void
}>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.RadioGroup disabled @update:value="(value) => onValueChange?.(value)">
            <Menu.RadioItem
              value="one"
              data-testid="item-1"
              @click="(event) => onItemClick?.(event)"
              @keydown="(event) => onItemKeyDown?.(event)"
            >
              one
            </Menu.RadioItem>
            <Menu.RadioItem
              value="two"
              data-testid="item-2"
              @click="(event) => onItemClick?.(event)"
              @keydown="(event) => onItemKeyDown?.(event)"
            >
              two
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

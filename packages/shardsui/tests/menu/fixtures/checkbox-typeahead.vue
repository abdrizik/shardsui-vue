<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onCheckedChange } = defineProps<{
  onCheckedChange?: (checked: boolean) => void
}>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.CheckboxItem
            data-testid="item-one"
            @update:checked="(checked) => onCheckedChange?.(checked)"
          >
            Item One
          </Menu.CheckboxItem>
          <Menu.CheckboxItem
            data-testid="item-two"
            @update:checked="(checked) => onCheckedChange?.(checked)"
          >
            Item Two
          </Menu.CheckboxItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>

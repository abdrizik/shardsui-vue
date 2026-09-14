<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const {
  delay,
  closeDelay,
  keepMountedPortal = false,
  orientation = 'horizontal',
  onValueChange
} = defineProps<{
  delay?: number
  closeDelay?: number
  keepMountedPortal?: boolean
  orientation?: 'horizontal' | 'vertical'
  onValueChange?: (value: unknown) => void
}>()

const value = defineModel<unknown>('value')
</script>

<template>
  <NavigationMenu.Root
    v-model:value="value"
    :delay="delay"
    :close-delay="closeDelay"
    :orientation="orientation"
    @update:value="onValueChange"
  >
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="popup-1">
          <NavigationMenu.Link href="#link-1">Link 1</NavigationMenu.Link>
          <NavigationMenu.Link href="#link-2">Link 2</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item value="item-2">
        <NavigationMenu.Trigger data-testid="trigger-2">Item 2</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="popup-2">
          <NavigationMenu.Link href="#link-3">Link 3</NavigationMenu.Link>
          <NavigationMenu.Link href="#link-4">Link 4</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal :keep-mounted="keepMountedPortal">
      <NavigationMenu.Positioner data-testid="top-level-positioner">
        <NavigationMenu.Popup data-testid="popup-root">
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

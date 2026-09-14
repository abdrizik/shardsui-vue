<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()
</script>

<template>
  <NavigationMenu.Root @update:value="onValueChange">
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>

        <NavigationMenu.Content data-testid="popup-1">
          <NavigationMenu.Link href="#link-1" close-on-click>Link 1</NavigationMenu.Link>
          <NavigationMenu.Root>
            <NavigationMenu.List>
              <NavigationMenu.Item value="nested-item-1">
                <NavigationMenu.Trigger data-testid="nested-trigger-1">
                  Nested Item 1
                </NavigationMenu.Trigger>
                <NavigationMenu.Content data-testid="nested-popup-1">
                  <NavigationMenu.Link
                    href="#nested-link-1"
                    close-on-click
                    data-testid="nested-link-1"
                  >
                    Nested Link 1
                  </NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Portal>
              <NavigationMenu.Positioner side="right">
                <NavigationMenu.Popup>
                  <NavigationMenu.Viewport />
                </NavigationMenu.Popup>
              </NavigationMenu.Positioner>
            </NavigationMenu.Portal>
          </NavigationMenu.Root>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup>
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

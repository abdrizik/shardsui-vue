<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'
import { Popover } from '@/components/popover'

function stopClick(event: MouseEvent) {
  event.stopPropagation()
}
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="popup-1">
          <Popover.Root>
            <Popover.Trigger data-testid="popover-trigger">Open popover</Popover.Trigger>
            <Popover.Portal>
              <Popover.Positioner>
                <Popover.Popup data-testid="popover-popup" @click="stopClick">
                  <button type="button" data-testid="popover-button">Popover button</button>
                </Popover.Popup>
              </Popover.Positioner>
            </Popover.Portal>
          </Popover.Root>
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

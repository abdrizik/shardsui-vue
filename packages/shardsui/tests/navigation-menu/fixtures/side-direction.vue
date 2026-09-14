<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import { NavigationMenu } from '@/components/navigation-menu'
import type { Side } from '@/internal/floating/anchor-positioning'

const { direction = 'ltr', side = 'left' } = defineProps<{
  direction?: 'ltr' | 'rtl'
  side?: Side
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <NavigationMenu.Root>
      <NavigationMenu.List>
        <NavigationMenu.Item value="item-1">
          <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#link-1">Link 1</NavigationMenu.Link>
          </NavigationMenu.Content>
        </NavigationMenu.Item>
      </NavigationMenu.List>
      <NavigationMenu.Portal>
        <NavigationMenu.Positioner :side="side">
          <NavigationMenu.Popup data-testid="popup-root">
            <NavigationMenu.Viewport />
          </NavigationMenu.Popup>
        </NavigationMenu.Positioner>
      </NavigationMenu.Portal>
    </NavigationMenu.Root>
  </DirectionProvider>
</template>

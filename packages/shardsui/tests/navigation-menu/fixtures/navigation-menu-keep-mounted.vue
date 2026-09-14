<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { portalKeepMounted = false } = defineProps<{ portalKeepMounted?: boolean }>()
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List data-testid="list">
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger>Item 1</NavigationMenu.Trigger>
        <NavigationMenu.Content keep-mounted data-testid="content-1">
          <NavigationMenu.Link href="#link-1">Link 1</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item value="item-2">
        <NavigationMenu.Trigger>Item 2</NavigationMenu.Trigger>
        <NavigationMenu.Content keep-mounted data-testid="content-2">
          <NavigationMenu.Link href="#link-2">Link 2</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal :keep-mounted="portalKeepMounted">
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup>
          <NavigationMenu.Viewport data-testid="viewport" />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

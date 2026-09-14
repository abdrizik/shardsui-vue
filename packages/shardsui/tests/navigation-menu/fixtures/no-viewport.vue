<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item value="item">
        <NavigationMenu.Trigger>Trigger</NavigationMenu.Trigger>
        <NavigationMenu.Content>Content</NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup>Popup</NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

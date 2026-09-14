<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()
</script>

<template>
  <NavigationMenu.Root data-testid="nav-root" @update:value="onValueChange">
    <NavigationMenu.List data-testid="nav-list">
      <NavigationMenu.Item>
        <NavigationMenu.Trigger data-testid="overview-trigger">Overview</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="overview-content">
          <p>Overview content</p>
          <NavigationMenu.Link href="#overview">Overview link</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Trigger data-testid="handbook-trigger">Handbook</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="handbook-content">
          <p>Handbook content</p>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item>
        <NavigationMenu.Link href="#github" data-testid="github-link">GitHub</NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner data-testid="nav-positioner">
        <NavigationMenu.Popup data-testid="nav-popup">
          <NavigationMenu.Viewport data-testid="nav-viewport" />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

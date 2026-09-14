<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { onContentFocusIn } = defineProps<{ onContentFocusIn?: (event: FocusEvent) => void }>()
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger data-testid="overview-trigger">Overview</NavigationMenu.Trigger>
        <NavigationMenu.Content
          data-testid="overview-content"
          style="color: rgb(255, 0, 0)"
          :on-focusin="onContentFocusIn"
        >
          <button type="button" data-testid="content-button">Inside</button>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup>
          <NavigationMenu.Viewport data-testid="nav-viewport" />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

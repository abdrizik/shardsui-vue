<script setup lang="ts">
import { shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const topValue = shallowRef<string | null>('item-1')
const nestedValue = shallowRef<string | null>('nested-item-1')
</script>

<template>
  <NavigationMenu.Root v-model:value="topValue" orientation="vertical" data-testid="top-level-root">
    <NavigationMenu.List data-testid="top-level-list">
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger>Item 1</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <NavigationMenu.Root
            v-model:value="nestedValue"
            orientation="vertical"
            data-testid="nested-root"
          >
            <NavigationMenu.List data-testid="nested-list">
              <NavigationMenu.Item value="nested-item-1">
                <NavigationMenu.Trigger>Nested Item 1</NavigationMenu.Trigger>
                <NavigationMenu.Content>
                  <NavigationMenu.Link href="#nested-link-1">Nested Link 1</NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport />
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

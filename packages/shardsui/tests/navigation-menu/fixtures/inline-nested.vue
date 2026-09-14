<script setup lang="ts">
import { shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const {
  initialNestedValue = 'nested-item-1',
  nestedItem1Value = 'nested-item-1',
  keepMountedContent = false,
  nestedLinkCloseOnClick = false
} = defineProps<{
  initialNestedValue?: string | number | boolean | null
  nestedItem1Value?: string | number | boolean
  keepMountedContent?: boolean
  nestedLinkCloseOnClick?: boolean
}>()

const nestedValue = shallowRef<unknown>(initialNestedValue)
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>

        <NavigationMenu.Content data-testid="popup-1" :keep-mounted="keepMountedContent">
          <NavigationMenu.Link href="#link-1">Link 1</NavigationMenu.Link>
          <NavigationMenu.Root v-model:value="nestedValue">
            <NavigationMenu.List data-testid="inline-nested-list">
              <NavigationMenu.Item :value="nestedItem1Value">
                <NavigationMenu.Trigger data-testid="nested-trigger-1">
                  Nested Item 1
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  data-testid="nested-popup-1"
                  :keep-mounted="keepMountedContent"
                >
                  <NavigationMenu.Link
                    href="#nested-link-1"
                    :close-on-click="nestedLinkCloseOnClick"
                  >
                    Nested Link 1
                  </NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="nested-item-2">
                <NavigationMenu.Trigger data-testid="nested-trigger-2">
                  Nested Item 2
                </NavigationMenu.Trigger>
                <NavigationMenu.Content
                  data-testid="nested-popup-2"
                  :keep-mounted="keepMountedContent"
                >
                  <NavigationMenu.Link href="#nested-link-2">Nested Link 2</NavigationMenu.Link>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
            </NavigationMenu.List>

            <NavigationMenu.Viewport data-testid="inline-nested-viewport" />
          </NavigationMenu.Root>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item value="item-2">
        <NavigationMenu.Trigger data-testid="trigger-2">Item 2</NavigationMenu.Trigger>
        <NavigationMenu.Content data-testid="popup-2" :keep-mounted="keepMountedContent">
          <NavigationMenu.Link href="#link-3">Link 3</NavigationMenu.Link>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner data-testid="positioner">
        <NavigationMenu.Popup data-testid="popup-root">
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

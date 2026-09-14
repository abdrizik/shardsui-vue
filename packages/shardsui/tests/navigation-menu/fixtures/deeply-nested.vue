<script setup lang="ts">
import { shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const level2Value = shallowRef<string | null>('level2-item-1')
const level3Value = shallowRef<string | null>('level3-item-1')
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>

        <NavigationMenu.Content data-testid="content-1">
          <NavigationMenu.Link href="#link-1" data-testid="link-1">Link 1</NavigationMenu.Link>
          <NavigationMenu.Root v-model:value="level2Value">
            <NavigationMenu.List>
              <NavigationMenu.Item value="level2-item-1">
                <NavigationMenu.Trigger data-testid="level2-trigger-1">
                  Level 2 Item 1
                </NavigationMenu.Trigger>
                <NavigationMenu.Content data-testid="level2-content-1">
                  <NavigationMenu.Link href="#level2-link-1" data-testid="level2-link-1">
                    Level 2 Link 1
                  </NavigationMenu.Link>
                  <NavigationMenu.Root v-model:value="level3Value">
                    <NavigationMenu.List>
                      <NavigationMenu.Item value="level3-item-1">
                        <NavigationMenu.Trigger data-testid="level3-trigger-1">
                          Level 3 Item 1
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content data-testid="level3-content-1">
                          <NavigationMenu.Link href="#level3-link-1">
                            Level 3 Link 1
                          </NavigationMenu.Link>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>
                      <NavigationMenu.Item value="level3-item-2">
                        <NavigationMenu.Trigger data-testid="level3-trigger-2">
                          Level 3 Item 2
                        </NavigationMenu.Trigger>
                        <NavigationMenu.Content data-testid="level3-content-2">
                          <NavigationMenu.Link href="#level3-link-2">
                            Level 3 Link 2
                          </NavigationMenu.Link>
                        </NavigationMenu.Content>
                      </NavigationMenu.Item>
                    </NavigationMenu.List>
                    <NavigationMenu.Viewport />
                  </NavigationMenu.Root>
                </NavigationMenu.Content>
              </NavigationMenu.Item>
              <NavigationMenu.Item value="level2-item-2">
                <NavigationMenu.Trigger data-testid="level2-trigger-2">
                  Level 2 Item 2
                </NavigationMenu.Trigger>
                <NavigationMenu.Content data-testid="level2-content-2">
                  <NavigationMenu.Link href="#level2-link-2">Level 2 Link 2</NavigationMenu.Link>
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

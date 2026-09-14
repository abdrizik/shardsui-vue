<script setup lang="ts">
import { shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const { initialContentStage = 0 } = defineProps<{ initialContentStage?: number }>()

const contentStage = shallowRef(initialContentStage)
const nestedValue = shallowRef<string | null>('nested-item-1')

function insertContent() {
  contentStage.value = Math.min(contentStage.value + 1, 2)
}
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-1">Item 1</NavigationMenu.Trigger>

        <NavigationMenu.Content>
          <div data-testid="popup-1">
            <NavigationMenu.Link href="#link-1">Link 1</NavigationMenu.Link>
            <NavigationMenu.Root v-model:value="nestedValue">
              <NavigationMenu.List>
                <NavigationMenu.Item value="nested-item-1">
                  <NavigationMenu.Trigger data-testid="nested-trigger-1">
                    Nested Item 1
                  </NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <div data-testid="nested-popup-1">
                      <button type="button" data-testid="insert-content" @click="insertContent">
                        Insert content
                      </button>
                      <div v-if="contentStage >= 1" data-testid="extra-content">
                        <NavigationMenu.Link href="#nested-link-1"
                          >Nested Link 1</NavigationMenu.Link
                        >
                        <NavigationMenu.Link href="#nested-link-2"
                          >Nested Link 2</NavigationMenu.Link
                        >
                        <NavigationMenu.Link href="#nested-link-3"
                          >Nested Link 3</NavigationMenu.Link
                        >
                      </div>
                      <div v-if="contentStage >= 2" data-testid="extra-content-2">
                        <NavigationMenu.Link href="#nested-link-4"
                          >Nested Link 4</NavigationMenu.Link
                        >
                        <NavigationMenu.Link href="#nested-link-5"
                          >Nested Link 5</NavigationMenu.Link
                        >
                      </div>
                    </div>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
              </NavigationMenu.List>

              <NavigationMenu.Viewport />
            </NavigationMenu.Root>
          </div>
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

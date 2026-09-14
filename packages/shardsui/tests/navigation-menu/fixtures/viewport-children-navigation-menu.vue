<script setup lang="ts">
import { onMounted, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const { registerContentRef } = defineProps<{
  registerContentRef?: (read: () => HTMLElement | null) => void
}>()

const content = useTemplateRef<ComponentPublicInstance>('content')

onMounted(() => {
  registerContentRef?.(() => (content.value?.$el as HTMLElement | null | undefined) ?? null)
})
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger data-testid="overview-trigger">Overview</NavigationMenu.Trigger>
        <NavigationMenu.Content ref="content" as="section" data-testid="overview-content">
          <p>Overview content</p>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup>
          <NavigationMenu.Viewport data-testid="nav-viewport">
            <span data-testid="viewport-child">Viewport child</span>
          </NavigationMenu.Viewport>
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>

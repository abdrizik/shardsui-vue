<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { onKeydown } = defineProps<{ onKeydown?: (event: KeyboardEvent) => void }>()
</script>

<template>
  <div role="presentation" @keydown="onKeydown">
    <NavigationMenu.Root orientation="vertical">
      <NavigationMenu.List data-testid="list">
        <NavigationMenu.Item>
          <NavigationMenu.Trigger>Item</NavigationMenu.Trigger>
        </NavigationMenu.Item>
      </NavigationMenu.List>
    </NavigationMenu.Root>
  </div>
</template>

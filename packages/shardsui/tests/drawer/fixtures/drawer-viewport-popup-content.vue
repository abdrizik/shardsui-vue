<script setup lang="ts">
import { Drawer, type DrawerSwipeDirection } from '@/components/drawer'

const { swipeDirection = 'down', onOpenChange } = defineProps<{
  swipeDirection?: DrawerSwipeDirection
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Drawer.Root open :swipe-direction="swipeDirection" @update:open="(next) => onOpenChange?.(next)">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport data-testid="viewport">
        <Drawer.Popup data-testid="popup">
          <Drawer.Content>Content</Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

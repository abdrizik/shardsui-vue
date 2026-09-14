<script setup lang="ts">
import { Drawer, type DrawerSwipeDirection } from '@/components/drawer'

const { swipeDirection = undefined, onOpenChange } = defineProps<{
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
          <button type="button" data-testid="button">Action</button>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
import { Drawer, type DrawerSnapPoint, type DrawerSwipeDirection } from '@/components/drawer'

const {
  snapPoints,
  swipeDirection = 'down',
  onOpenChange
} = defineProps<{
  snapPoints: DrawerSnapPoint[]
  swipeDirection?: DrawerSwipeDirection
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Drawer.Root
    open
    :snap-points="snapPoints"
    :swipe-direction="swipeDirection"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <Drawer.Portal>
      <Drawer.Viewport data-testid="viewport">
        <Drawer.Popup
          data-testid="popup"
          style="height: 0; padding: 0; border: 0; overflow: hidden"
        >
          Drawer
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

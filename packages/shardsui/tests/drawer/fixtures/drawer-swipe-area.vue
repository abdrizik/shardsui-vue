<script setup lang="ts">
import { Drawer, type DrawerSwipeDirection } from '@/components/drawer'

const {
  disabled = false,
  swipeDirection = undefined,
  includePopup = false,
  onOpenChange
} = defineProps<{
  disabled?: boolean
  swipeDirection?: DrawerSwipeDirection
  includePopup?: boolean
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Drawer.Root @update:open="(next) => onOpenChange?.(next)">
    <Drawer.SwipeArea
      data-testid="swipe-area"
      :disabled="disabled"
      :swipe-direction="swipeDirection"
    />
    <Drawer.Portal v-if="includePopup">
      <Drawer.Viewport>
        <Drawer.Popup data-testid="popup">Drawer</Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

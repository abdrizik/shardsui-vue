<script setup lang="ts">
import { Drawer, type DrawerSnapPoint, type DrawerSwipeDirection } from '@/components/drawer'

const {
  swipeDirection = 'down',
  axis = 'y',
  snapPoints = undefined,
  onOpenChange
} = defineProps<{
  swipeDirection?: DrawerSwipeDirection
  axis?: 'y' | 'x' | 'both'
  snapPoints?: DrawerSnapPoint[]
  onOpenChange?: (open: boolean) => void
}>()
</script>

<template>
  <Drawer.Root
    open
    :swipe-direction="swipeDirection"
    :snap-points="snapPoints"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport>
        <Drawer.Popup data-testid="popup">
          <div v-if="axis === 'x'" data-testid="scroll" style="overflow-x: auto; max-width: 40px">
            <div style="width: 120px; height: 40px">Scrollable content</div>
          </div>
          <div
            v-else-if="axis === 'both'"
            data-testid="scroll"
            style="overflow: auto; width: 40px; height: 40px"
          >
            <div style="width: 120px; height: 120px">Scrollable content</div>
          </div>
          <div v-else data-testid="scroll" style="overflow-y: auto; max-height: 40px">
            <div style="height: 120px">Scrollable content</div>
          </div>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

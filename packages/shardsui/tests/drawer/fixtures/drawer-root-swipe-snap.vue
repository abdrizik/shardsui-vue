<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer, type DrawerSnapPoint, type DrawerSwipeDirection } from '@/components/drawer'

const {
  swipeDirection = 'down',
  snapPoints = ['100px', '300px', 1],
  snapToSequentialPoints = false,
  initialSnapPoint = undefined,
  viewportHeight = 600,
  popupHeight = 600,
  showActiveSnap = false,
  withBackdrop = true,
  onOpenChange,
  onSnapPointChange
} = defineProps<{
  swipeDirection?: DrawerSwipeDirection
  snapPoints?: DrawerSnapPoint[]
  snapToSequentialPoints?: boolean
  initialSnapPoint?: DrawerSnapPoint | null
  viewportHeight?: number
  popupHeight?: number
  showActiveSnap?: boolean
  withBackdrop?: boolean
  onOpenChange?: (open: boolean) => void
  onSnapPointChange?: (snapPoint: DrawerSnapPoint | null) => void
}>()

const open = shallowRef(true)
const snapPoint = shallowRef<DrawerSnapPoint | null>(initialSnapPoint ?? snapPoints[0] ?? null)

function handleOpenChange(next: boolean) {
  open.value = next
  onOpenChange?.(next)
}

function handleSnapPointChange(next: DrawerSnapPoint | null | undefined) {
  onSnapPointChange?.(next ?? null)
}
</script>

<template>
  <div v-if="showActiveSnap" data-testid="active-snap">{{ String(snapPoint) }}</div>
  <button data-testid="snap-to-first" @click="snapPoint = snapPoints[0] ?? null">
    Snap to first
  </button>
  <Drawer.Root
    v-model:snap-point="snapPoint"
    :open="open"
    :snap-points="[...snapPoints]"
    :snap-to-sequential-points="snapToSequentialPoints"
    :swipe-direction="swipeDirection"
    @update:open="handleOpenChange"
    @update:snap-point="handleSnapPointChange"
  >
    <Drawer.Portal>
      <Drawer.Backdrop v-if="withBackdrop" data-testid="backdrop" />
      <Drawer.Viewport data-testid="viewport" :style="{ height: `${viewportHeight}px` }">
        <Drawer.Popup data-testid="popup" :style="{ height: `${popupHeight}px` }">
          Drawer
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

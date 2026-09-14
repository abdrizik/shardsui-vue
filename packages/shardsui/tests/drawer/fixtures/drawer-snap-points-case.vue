<script setup lang="ts">
import { Drawer, type DrawerSnapPoint } from '@/components/drawer'
import DrawerSnapPointProbe from './drawer-snap-point-probe.vue'

const {
  snapPoints,
  snapPoint,
  popupHeight = 300,
  viewportHeight = 400
} = defineProps<{
  snapPoints: DrawerSnapPoint[]
  snapPoint?: DrawerSnapPoint | null
  popupHeight?: number
  viewportHeight?: number
}>()
</script>

<template>
  <Drawer.Root open :modal="false" :snap-points="snapPoints" :snap-point="snapPoint">
    <Drawer.Portal>
      <Drawer.Viewport data-testid="viewport" :style="{ height: `${viewportHeight}px` }">
        <DrawerSnapPointProbe />
        <Drawer.Popup data-testid="popup" :style="{ height: `${popupHeight}px` }">
          Drawer
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

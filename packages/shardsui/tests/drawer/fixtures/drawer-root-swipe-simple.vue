<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Drawer, type DrawerSwipeDirection } from '@/components/drawer'

const {
  swipeDirection = 'down',
  mode = 'controlled',
  viewportHeight = 300,
  popupHeight = 200,
  onOpenChange
} = defineProps<{
  swipeDirection?: DrawerSwipeDirection
  mode?: 'controlled' | 'alwaysOpen'
  viewportHeight?: number
  popupHeight?: number
  onOpenChange?: (open: boolean) => void
}>()

const localOpen = shallowRef(true)
const open = computed(() => (mode === 'alwaysOpen' ? true : localOpen.value))

function setOpen(next: boolean) {
  onOpenChange?.(next)
  if (mode === 'alwaysOpen') return
  localOpen.value = next
}
</script>

<template>
  <Drawer.Root :open="open" :swipe-direction="swipeDirection" @update:open="setOpen">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport data-testid="viewport" :style="{ height: `${viewportHeight}px` }">
        <Drawer.Popup data-testid="popup" :style="{ height: `${popupHeight}px` }">
          Drawer
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

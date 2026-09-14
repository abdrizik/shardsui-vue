<script setup lang="ts">
import { Drawer, type DrawerSwipeDirection } from '@/components/drawer'

const {
  swipeDirection = undefined,
  onOpenChange,
  onTargetClick,
  swipeIgnore = false
} = defineProps<{
  swipeDirection?: DrawerSwipeDirection
  onOpenChange?: (open: boolean) => void
  onTargetClick?: () => void
  swipeIgnore?: boolean
}>()
</script>

<template>
  <Drawer.Root open :swipe-direction="swipeDirection" @update:open="(next) => onOpenChange?.(next)">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport data-testid="viewport">
        <Drawer.Popup data-testid="popup">
          <Drawer.Content>
            <div
              data-testid="target"
              :data-shards-ui-swipe-ignore="swipeIgnore ? '' : undefined"
              role="presentation"
              @click="onTargetClick?.()"
            >
              <span data-testid="text">Selectable</span>
            </div>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

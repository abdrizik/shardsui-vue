<script setup lang="ts">
import { Drawer, type DrawerSwipeDirection } from '@/components/drawer'

const { swipeDirection = 'down', variant = 'inner' } = defineProps<{
  swipeDirection?: DrawerSwipeDirection
  variant?: 'inner' | 'ancestor' | 'none'
}>()
</script>

<template>
  <Drawer.Root open :swipe-direction="swipeDirection">
    <Drawer.Portal>
      <Drawer.Viewport data-testid="viewport">
        <div
          v-if="variant === 'ancestor'"
          data-testid="scroll"
          style="overflow-y: auto; max-height: 40px"
        >
          <Drawer.Popup data-testid="popup">
            <Drawer.Content>
              <span data-testid="item">Scrollable content</span>
            </Drawer.Content>
          </Drawer.Popup>
        </div>
        <Drawer.Popup v-else-if="variant === 'none'" data-testid="popup">
          <Drawer.Content>Content</Drawer.Content>
        </Drawer.Popup>
        <Drawer.Popup v-else data-testid="popup">
          <div data-testid="scroll" style="overflow-y: auto; max-height: 40px">
            <div style="height: 120px">Scrollable content</div>
          </div>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

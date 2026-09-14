<script setup lang="ts">
import { Drawer } from '@/components/drawer'

const { popupHeight = 200 } = defineProps<{ popupHeight?: number }>()
</script>

<template>
  <Drawer.Root>
    <Drawer.SwipeArea data-testid="swipe-area" />
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport>
        <Drawer.Popup data-testid="popup" :style="{ height: `${popupHeight}px` }">
          Drawer
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

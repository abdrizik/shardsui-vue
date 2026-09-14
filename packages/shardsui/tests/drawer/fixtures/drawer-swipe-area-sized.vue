<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root>
    <Drawer.SwipeArea data-testid="swipe-area" />
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup data-testid="popup" style="height: 200px">Drawer</Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

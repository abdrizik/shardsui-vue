<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root
    open
    :modal="false"
    swipe-direction="up"
    :snap-points="['100px', '300px']"
    snap-point="100px"
  >
    <Drawer.Portal>
      <Drawer.Viewport data-testid="viewport" style="height: 400px">
        <Drawer.Popup data-testid="popup" style="height: 300px">Drawer</Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

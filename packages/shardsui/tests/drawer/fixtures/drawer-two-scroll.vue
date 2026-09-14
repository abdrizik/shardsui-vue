<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root open swipe-direction="down">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport>
        <Drawer.Popup>
          <div data-testid="scroll" style="overflow-y: auto; max-height: 40px">
            <button type="button" data-testid="button">Action</button>
            <div style="height: 120px"></div>
          </div>
          <div data-testid="other-scroll" style="overflow-y: auto; max-height: 40px">
            <div style="height: 120px"></div>
          </div>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

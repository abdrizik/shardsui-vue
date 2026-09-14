<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer } from '@/components/drawer'
import DrawerActiveSnapDisplay from './drawer-active-snap-display.vue'

const snapPoints = ['100px', '300px', 1] as const
const open = shallowRef(true)
</script>

<template>
  <Drawer.Root v-model:open="open" :snap-point="snapPoints[1]" :snap-points="[...snapPoints]">
    <DrawerActiveSnapDisplay />
    <Drawer.Portal>
      <Drawer.Viewport data-testid="viewport">
        <Drawer.Popup data-testid="popup">
          Drawer
          <Drawer.Close data-testid="close">Close</Drawer.Close>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

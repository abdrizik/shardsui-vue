<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer, type DrawerSnapPoint } from '@/components/drawer'

const snapPoints: DrawerSnapPoint[] = ['100px', '300px', 1]

const open = shallowRef(true)
const snapPoint = shallowRef<DrawerSnapPoint | null>(snapPoints[0]!)

function setOpen(next: boolean) {
  if (!next) return
  open.value = next
}
</script>

<template>
  <div>
    <div data-testid="active-snap">{{ String(snapPoint) }}</div>
    <Drawer.Root
      v-model:snap-point="snapPoint"
      :open="open"
      :snap-points="[...snapPoints]"
      swipe-direction="down"
      @update:open="setOpen"
    >
      <Drawer.Portal>
        <Drawer.Backdrop data-testid="backdrop" />
        <Drawer.Viewport data-testid="viewport" style="height: 600px">
          <Drawer.Popup data-testid="popup" style="height: 600px">Drawer</Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  </div>
</template>

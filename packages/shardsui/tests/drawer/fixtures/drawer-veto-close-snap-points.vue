<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer, type DrawerSnapPoint } from '@/components/drawer'

const snapPoints: DrawerSnapPoint[] = ['100px', '300px', 1]

const open = shallowRef(true)
const snapPoint = shallowRef<DrawerSnapPoint | null>(snapPoints[2]!)

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
      @update:open="setOpen"
    >
      <Drawer.Portal>
        <Drawer.Viewport data-testid="viewport">
          <Drawer.Popup data-testid="popup">
            Drawer
            <Drawer.Close data-testid="close">Close</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  </div>
</template>

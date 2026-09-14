<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer, type DrawerSnapPoint } from '@/components/drawer'

const snapPoints = ['100px', '300px', 1] as const

const open = shallowRef(true)
const snapPoint = shallowRef<DrawerSnapPoint | null>(snapPoints[0])
</script>

<template>
  <div data-testid="active-snap">{{ String(snapPoint) }}</div>
  <button data-testid="expand" @click="snapPoint = 1">Expand</button>

  <Drawer.Root v-model:open="open" v-model:snap-point="snapPoint" :snap-points="[...snapPoints]">
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

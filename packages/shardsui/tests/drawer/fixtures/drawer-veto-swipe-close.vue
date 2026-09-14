<script setup lang="ts">
import { shallowRef } from 'vue'
import { Drawer } from '@/components/drawer'

const open = shallowRef(true)

function setOpen(next: boolean) {
  if (!next) return
  open.value = next
}
</script>

<template>
  <Drawer.Root :open="open" swipe-direction="down" @update:open="setOpen">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport data-testid="viewport" style="height: 300px">
        <Drawer.Popup data-testid="popup" style="height: 200px">Drawer</Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

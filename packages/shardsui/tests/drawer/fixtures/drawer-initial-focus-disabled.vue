<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root :modal="false">
    <Drawer.Trigger>Open</Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup :initial-focus="false">Drawer</Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
import { Drawer } from '@/components/drawer'

const { open = true } = defineProps<{ open?: boolean }>()
</script>

<template>
  <Drawer.Root :open="open">
    <Drawer.Portal>
      <Drawer.Popup>
        <Drawer.Title>Drawer title</Drawer.Title>
      </Drawer.Popup>
    </Drawer.Portal>
  </Drawer.Root>
</template>

<script setup lang="ts">
import { Drawer } from '@/components/drawer'

const { open = false } = defineProps<{ open?: boolean }>()
</script>

<template>
  <Drawer.Provider>
    <Drawer.IndentBackground data-testid="bg" />
    <Drawer.Root :open="open">
      <Drawer.Trigger>Open</Drawer.Trigger>
    </Drawer.Root>
  </Drawer.Provider>
</template>

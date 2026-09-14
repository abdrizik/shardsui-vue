<script setup lang="ts">
import { Drawer } from '@/components/drawer'

const {
  firstOpen = false,
  secondOpen = false,
  showSecond = true
} = defineProps<{ firstOpen?: boolean; secondOpen?: boolean; showSecond?: boolean }>()
</script>

<template>
  <Drawer.Provider>
    <Drawer.IndentBackground data-testid="background" />
    <Drawer.Root :open="firstOpen">First drawer</Drawer.Root>
    <Drawer.Root v-if="showSecond" :open="secondOpen">Second drawer</Drawer.Root>
  </Drawer.Provider>
</template>

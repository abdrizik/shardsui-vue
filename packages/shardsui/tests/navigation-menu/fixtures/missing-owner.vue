<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { part } = defineProps<{ part: 'icon' | 'positioner' | 'arrow' }>()
</script>

<template>
  <NavigationMenu.Root value="one">
    <NavigationMenu.Icon v-if="part === 'icon'" />
    <NavigationMenu.Positioner v-else-if="part === 'positioner'" />
    <NavigationMenu.Arrow v-else />
  </NavigationMenu.Root>
</template>

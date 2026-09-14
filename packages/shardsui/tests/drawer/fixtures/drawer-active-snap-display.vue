<script setup lang="ts">
import { DrawerContext } from '@/components/drawer/context'

const drawer = DrawerContext.get()
</script>

<template>
  <div data-testid="active-snap">{{ String(drawer.activeSnapPoint.value) }}</div>
</template>

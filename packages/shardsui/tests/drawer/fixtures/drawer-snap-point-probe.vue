<script setup lang="ts">
import { DrawerViewportContext } from '@/components/drawer/context'

const viewport = DrawerViewportContext.get()
</script>

<template>
  <output data-testid="snap-point-probe">{{ String(viewport.activeSnapPointOffset.value) }}</output>
</template>

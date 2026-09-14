<script setup lang="ts">
import { Drawer } from '@/components/drawer'
import ProviderControls from './provider-controls.vue'
</script>

<template>
  <Drawer.Provider>
    <Drawer.IndentBackground data-testid="background" />
    <Drawer.Indent data-testid="indent" />
    <ProviderControls />
  </Drawer.Provider>
</template>

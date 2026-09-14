<script setup lang="ts">
import { createDialogRoot } from '@/components/dialog/dialog'
import { DrawerProviderContext } from '@/components/drawer/context'

const provider = DrawerProviderContext.get()

const registered = createDialogRoot()
const missing = createDialogRoot()
</script>

<template>
  <button @click="provider.setDrawerOpen(registered, true)">Register open</button>
  <button @click="provider.setDrawerOpen(registered, false)">Register closed</button>
  <button @click="provider.setDrawerOpen(missing, false)">Remove missing</button>
  <button @click="provider.setVisualState({ swipeProgress: 0.5, frontmostHeight: 120 })">
    Set visual state
  </button>
  <button @click="provider.setVisualState({ swipeProgress: 0, frontmostHeight: 0 })">
    Clear visual state
  </button>
  <button
    @click="provider.setVisualState({ swipeProgress: Number.NaN, frontmostHeight: Infinity })"
  >
    Set invalid visual state
  </button>
</template>

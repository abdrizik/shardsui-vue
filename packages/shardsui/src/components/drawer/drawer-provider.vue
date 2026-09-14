<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import type { DialogRoot } from '@/components/dialog/dialog'
import { DrawerProviderContext, type DrawerVisual } from './context'

defineOptions({ inheritAttrs: false })

defineSlots<{ default?: () => any }>()

const openDrawers = shallowRef(new Set<DialogRoot>())

function setDrawerOpen(drawer: DialogRoot, open: boolean) {
  const next = new Set(openDrawers.value)
  if (open) next.add(drawer)
  else next.delete(drawer)
  if (next.size === openDrawers.value.size) return
  openDrawers.value = next
}

const active = computed(() => openDrawers.value.size > 0)

const visualState = shallowRef<DrawerVisual>({ swipeProgress: 0, frontmostHeight: 0 })

function setVisualState(next: DrawerVisual) {
  visualState.value = {
    swipeProgress: Number.isFinite(next.swipeProgress) ? next.swipeProgress : 0,
    frontmostHeight: Number.isFinite(next.frontmostHeight) ? next.frontmostHeight : 0
  }
}

DrawerProviderContext.set({ active, setDrawerOpen, visualState, setVisualState })
</script>

<template>
  <slot />
</template>

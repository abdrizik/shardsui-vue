<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { DrawerProviderContext, type DrawerIndentState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: DrawerIndentState) => any }>()

const provider = DrawerProviderContext.getOr()

const active = computed(() => provider?.active.value ?? false)
const swipeProgress = computed(() => provider?.visualState.value.swipeProgress ?? 0)
const frontmostHeight = computed(() => provider?.visualState.value.frontmostHeight ?? 0)

const drawerState = computed<DrawerIndentState>(() => ({ active: active.value }))

const stateAttrs = computed(() =>
  dataAttrs({
    active: active.value,
    inactive: !active.value
  })
)

const style = computed(() => ({
  '--drawer-swipe-progress': swipeProgress.value > 0 ? swipeProgress.value : 0,
  '--drawer-height': frontmostHeight.value > 0 ? `${frontmostHeight.value}px` : undefined
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, $attrs)" :style="style">
    <slot v-bind="drawerState" />
  </component>
</template>

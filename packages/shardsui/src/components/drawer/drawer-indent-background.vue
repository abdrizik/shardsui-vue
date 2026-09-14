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

const drawerState = computed<DrawerIndentState>(() => ({ active: active.value }))

const stateAttrs = computed(() =>
  dataAttrs({
    active: active.value,
    inactive: !active.value
  })
)
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, $attrs)">
    <slot v-bind="drawerState" />
  </component>
</template>

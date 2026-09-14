<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuContext,
  NavigationMenuItemContext,
  type NavigationMenuIconState
} from './context'

defineOptions({ inheritAttrs: false })

const { as = 'span' } = defineProps<PartProps>()

const slots = defineSlots<{ default?: (state: NavigationMenuIconState) => any }>()

const navigationMenu = NavigationMenuContext.get()
const item = NavigationMenuItemContext.get()

const isActive = computed(
  () => navigationMenu.open.value && item.value.value === navigationMenu.value.value
)

const stateAttrs = computed(() => dataAttrs({ 'popup-open': isActive.value }))

const ownAttrs = { 'aria-hidden': 'true' }
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-if="slots.default" :open="isActive" />
    <template v-else>▼</template>
  </component>
</template>

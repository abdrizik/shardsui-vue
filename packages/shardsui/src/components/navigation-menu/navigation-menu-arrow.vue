<script setup lang="ts">
import { computed } from 'vue'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import type { AnchoredArrowState } from '@/internal/anchored-state'
import PositionerArrow from '@/internal/positioner-arrow.vue'
import type { PartProps } from '@/internal/types'
import { NavigationMenuContext, NavigationMenuPositionerContext } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: AnchoredArrowState) => any }>()

const navigationMenu = NavigationMenuContext.get()
const positioner = NavigationMenuPositionerContext.get()

const arrowStyle = computed(() =>
  getDisabledMountTransitionStyles(navigationMenu.transitionStatus.value)
)
</script>

<template>
  <PositionerArrow
    :positioner="positioner"
    :as="as"
    :open="navigationMenu.open.value"
    v-bind="$attrs"
    :style="arrowStyle"
  >
    <template #default="state">
      <slot v-bind="state as AnchoredArrowState" />
    </template>
  </PositionerArrow>
</template>

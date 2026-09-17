<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useId, watchPostEffect } from 'vue'
import { anchoredPopupAttrs } from '@/internal/anchored-state'
import { dataAttrs } from '@/internal/data-attrs'
import { DirectionContext } from '@/internal/direction-context'
import { getDisabledMountTransitionStyles } from '@/internal/get-disabled-mount-transition-styles'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import {
  NavigationMenuContext,
  NavigationMenuPositionerContext,
  type NavigationMenuPopupState
} from './context'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'nav', id: idProp } = defineProps<Props>()

defineSlots<{ default?: (state: NavigationMenuPopupState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const navigationMenu = NavigationMenuContext.get()
const positioner = NavigationMenuPositionerContext.get()
const direction = DirectionContext.get()

const element = usePartElement()

watchPostEffect(() => {
  navigationMenu.popupElement.value = element.value
  onWatcherCleanup(() => {
    navigationMenu.popupElement.value = null
  })
})

const isPhysicalLeft = computed(
  () =>
    positioner.side.value === 'left' ||
    (direction.direction.value === 'rtl'
      ? positioner.side.value === 'inline-end'
      : positioner.side.value === 'inline-start')
)

const isOriginSide = computed(() => positioner.side.value === 'top' || isPhysicalLeft.value)

const originStyle = computed(() => {
  if (!isOriginSide.value) return undefined
  return {
    position: 'absolute',
    ...(positioner.side.value === 'top' ? { bottom: '0' } : { top: '0' }),
    ...(isPhysicalLeft.value ? { right: '0' } : { left: '0' })
  }
})

const popupStyle = computed(() => ({
  ...originStyle.value,
  ...getDisabledMountTransitionStyles(navigationMenu.transitionStatus.value)
}))

const navigationMenuState = computed<NavigationMenuPopupState>(() => ({
  open: navigationMenu.open.value,
  transitionStatus: navigationMenu.transitionStatus.value,
  side: positioner.side.value,
  align: positioner.align.value,
  anchorHidden: positioner.anchorHidden.value
}))

const stateAttrs = computed(() => ({
  ...anchoredPopupAttrs(navigationMenuState.value),
  ...dataAttrs({ 'anchor-hidden': positioner.anchorHidden.value })
}))

const ownAttrs = computed(() => ({ id: id.value, tabindex: -1 }))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="popupStyle"
  >
    <slot v-bind="navigationMenuState" />
  </component>
</template>

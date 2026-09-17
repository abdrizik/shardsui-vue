<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import { dataAttrs } from '@/internal/data-attrs'
import type { AnchorPositioningProps } from '@/internal/floating/anchor-positioning'
import { FloatingNodeContext } from '@/internal/floating/floating-tree'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import InternalBackdrop from '@/internal/internal-backdrop.vue'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { MenuContext, MenuPositionerContext, type MenuPositionerState } from './context'
import { useMenuPositioner } from './positioner'

type Props = PartProps & AnchorPositioningProps

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  side,
  align,
  sideOffset,
  alignOffset,
  collisionBoundary,
  collisionPadding,
  collisionAvoidance,
  sticky = undefined,
  arrowPadding,
  disableAnchorTracking = undefined,
  anchor,
  positionMethod
} = defineProps<Props>()

defineSlots<{ default?: (state: MenuPositionerState) => any }>()

const menu = MenuContext.get()
AnchoredPortalContext.get()

FloatingNodeContext.set({
  get id() {
    return menu.nodeId.value
  }
})

const element = usePartElement()
const backdrop = useTemplateRef<{ element: HTMLElement | null }>('backdrop')

watchPostEffect(() => {
  menu.positionerElement.value = element.value
  onWatcherCleanup(() => {
    menu.positionerElement.value = null
  })
})

watchPostEffect(() => {
  menu.internalBackdropElement.value = backdrop.value?.element ?? null
  onWatcherCleanup(() => {
    menu.internalBackdropElement.value = null
  })
})

const positioner = useMenuPositioner(menu, {
  ref: element,
  side: () => side,
  align: () => align,
  sideOffset: () => sideOffset,
  alignOffset: () => alignOffset,
  collisionBoundary: () => collisionBoundary,
  collisionPadding: () => collisionPadding,
  collisionAvoidance: () => collisionAvoidance,
  sticky: () => sticky,
  arrowPadding: () => arrowPadding,
  disableAnchorTracking: () => disableAnchorTracking,
  anchor: () => anchor,
  positionMethod: () => positionMethod
})

const positioning = positioner.positioning

MenuPositionerContext.set(positioning)

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const nested = computed(() => menu.parentType.value === 'menu')

const menuState = computed<MenuPositionerState>(() => ({
  open: menu.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value,
  nested: nested.value,
  instant: menu.instantType.value
}))

const stateAttrs = computed(() => ({
  ...anchoredPositionerAttrs(menuState.value),
  ...dataAttrs({ nested: nested.value })
}))

const ownAttrs = computed(() => ({
  hidden: !menu.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(menu.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(menu.open.value ? undefined : { pointerEvents: 'none' })
}))
</script>

<template>
  <InternalBackdrop
    v-if="positioner.shouldRenderBackdrop.value"
    ref="backdrop"
    :inert="menu.open.value ? undefined : true"
    :cutout="positioner.backdropCutout.value"
  />
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="menuState" />
  </component>
</template>

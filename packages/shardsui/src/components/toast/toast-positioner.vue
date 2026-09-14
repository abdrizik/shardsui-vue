<script setup lang="ts">
import { computed, mergeProps, useTemplateRef } from 'vue'
import { POPUP_COLLISION_AVOIDANCE } from '@/internal/constants'
import { dataAttrs } from '@/internal/data-attrs'
import {
  useAnchorPositioning,
  type AnchorPositioningProps,
  type CollisionAvoidance,
  type Side
} from '@/internal/floating/anchor-positioning'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import type { PartProps } from '@/internal/types'
import { ToastPositionerContext, ToastProviderContext, type ToastPositionerState } from './context'
import type { ToastObject } from './types'

type Props = PartProps &
  AnchorPositioningProps & {
    toast: ToastObject
    anchor?: Element | null
  }

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  toast,
  side: sideProp,
  align: alignProp,
  sideOffset: sideOffsetProp,
  alignOffset: alignOffsetProp,
  collisionBoundary: collisionBoundaryProp,
  collisionPadding: collisionPaddingProp,
  collisionAvoidance: collisionAvoidanceProp,
  sticky: stickyProp = undefined,
  arrowPadding: arrowPaddingProp,
  disableAnchorTracking: disableAnchorTrackingProp = undefined,
  anchor: anchorProp,
  positionMethod: positionMethodProp
} = defineProps<Props>()

defineSlots<{ default?: (state: ToastPositionerState) => any }>()

const provider = ToastProviderContext.get()

const element = useTemplateRef<HTMLElement>('element')

const posProps = computed(() => toast.positionerProps ?? {})
const anchor = computed<Element | null>(
  () => (anchorProp !== undefined ? anchorProp : posProps.value.anchor) ?? null
)
const side = computed<Side>(() => sideProp ?? posProps.value.side ?? 'top')
const align = computed(() => alignProp ?? posProps.value.align)
const sideOffset = computed(() => sideOffsetProp ?? posProps.value.sideOffset)
const alignOffset = computed(() => alignOffsetProp ?? posProps.value.alignOffset)
const collisionBoundary = computed(() => collisionBoundaryProp ?? posProps.value.collisionBoundary)
const collisionPadding = computed(() => collisionPaddingProp ?? posProps.value.collisionPadding)
const collisionAvoidance = computed<CollisionAvoidance>(
  () => collisionAvoidanceProp ?? posProps.value.collisionAvoidance ?? POPUP_COLLISION_AVOIDANCE
)
const sticky = computed(() => stickyProp ?? posProps.value.sticky)
const arrowPadding = computed(() => arrowPaddingProp ?? posProps.value.arrowPadding)
const disableAnchorTracking = computed(
  () => disableAnchorTrackingProp ?? posProps.value.disableAnchorTracking
)
const positionMethod = computed(() => positionMethodProp ?? posProps.value.positionMethod)

const positioning = useAnchorPositioning({
  anchor,
  floating: element,
  side,
  align,
  sideOffset: () => sideOffset.value,
  alignOffset: () => alignOffset.value,
  positionMethod,
  collisionBoundary,
  collisionPadding,
  collisionAvoidance,
  sticky,
  arrowPadding,
  disableAnchorTracking
})

ToastPositionerContext.set(positioning)

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const toastIndex = computed(() => provider.stackIndexOf(toast))

const toastState = computed<ToastPositionerState>(() => ({
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value
}))

const stateAttrs = computed(() =>
  dataAttrs({
    side: positioning.side.value,
    align: positioning.align.value,
    'anchor-hidden': positioning.anchorHidden.value
  })
)

const positionerStyle = computed(() => ({
  ...(toast.transitionStatus === 'starting' ? { transition: 'none' } : undefined),
  '--toast-index': String(toastIndex.value)
}))
</script>

<template>
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, { role: 'presentation' }, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="toastState" />
  </component>
</template>

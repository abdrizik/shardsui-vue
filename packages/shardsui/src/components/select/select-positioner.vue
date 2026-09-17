<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watchEffect, watchPostEffect } from 'vue'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import { DROPDOWN_COLLISION_AVOIDANCE } from '@/internal/constants'
import {
  useAnchorPositioning,
  type AnchorPositioningProps
} from '@/internal/floating/anchor-positioning'
import { useAnchoredPopupScrollLock } from '@/internal/floating/anchored-popup-scroll-lock'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import InternalBackdrop from '@/internal/internal-backdrop.vue'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { SelectContext, SelectPositionerContext, type SelectPositionerState } from './context'

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
  collisionAvoidance = DROPDOWN_COLLISION_AVOIDANCE,
  sticky = undefined,
  arrowPadding,
  disableAnchorTracking = undefined,
  anchor,
  positionMethod
} = defineProps<Props>()

defineSlots<{ default?: (state: SelectPositionerState) => any }>()

const select = SelectContext.get()

const element = usePartElement()

watchPostEffect(() => {
  select.positionerElement.value = element.value
  onWatcherCleanup(() => {
    select.positionerElement.value = null
  })
})

useAnchoredPopupScrollLock({
  enabled: () => select.open.value && select.modal.value,
  touchOpen: () => select.openMethod.value === 'touch',
  positionerElement: element,
  referenceElement: select.triggerElement
})

const anchorElement = computed(() => anchor ?? select.triggerElement.value)

const positioning = useAnchorPositioning({
  anchor: () => (select.mounted.value ? anchorElement.value : null),
  floating: () => (select.mounted.value ? element.value : null),
  side: () => side,
  align: () => align,
  sideOffset: () => sideOffset,
  alignOffset: () => alignOffset,
  positionMethod: () => positionMethod,
  collisionBoundary: () => collisionBoundary,
  collisionPadding: () => collisionPadding,
  collisionAvoidance: () => collisionAvoidance,
  sticky: () => sticky,
  arrowPadding: () => arrowPadding,
  disableAnchorTracking: () => disableAnchorTracking
})

watchEffect(() => {
  select.popupSide.value = select.mounted.value ? positioning.side.value : null
  onWatcherCleanup(() => {
    select.popupSide.value = null
  })
})

SelectPositionerContext.set(positioning)

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const showBackdrop = computed(() => select.mounted.value && select.modal.value)

const selectState = computed<SelectPositionerState>(() => ({
  open: select.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value
}))

const stateAttrs = computed(() => anchoredPositionerAttrs(selectState.value))

const ownAttrs = computed(() => ({
  hidden: !select.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(select.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(select.open.value ? undefined : { pointerEvents: 'none' })
}))
</script>

<template>
  <InternalBackdrop
    v-if="showBackdrop"
    :inert="select.open.value ? undefined : true"
    :cutout="select.triggerElement.value"
  />
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="selectState" />
  </component>
</template>

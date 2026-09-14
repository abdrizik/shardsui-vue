<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  useTemplateRef,
  watchEffect,
  watchPostEffect
} from 'vue'
import { AnchoredPortalContext } from '@/internal/anchored-portal'
import { anchoredPositionerAttrs } from '@/internal/anchored-state'
import { createAnimationsFinished } from '@/internal/animations-finished'
import {
  useAnchorPositioning,
  type AnchorPositioningProps
} from '@/internal/floating/anchor-positioning'
import { useAnchoredPopupScrollLock } from '@/internal/floating/anchored-popup-scroll-lock'
import { usePositionerStyle } from '@/internal/floating/positioner-style'
import InternalBackdrop from '@/internal/internal-backdrop.vue'
import { REASONS } from '@/internal/reasons'
import type { PartProps } from '@/internal/types'
import { PopoverContext, PopoverPositionerContext, type PopoverPositionerState } from './context'

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

defineSlots<{ default?: (state: PopoverPositionerState) => any }>()

const popover = PopoverContext.get()
AnchoredPortalContext.get()

const element = useTemplateRef<HTMLElement>('element')

watchPostEffect(() => {
  popover.positionerElement.value = element.value
  onWatcherCleanup(() => {
    popover.positionerElement.value = null
  })
})

let prevTriggerElement: Element | null = null

const anchorElement = computed(() => anchor ?? popover.triggerElement.value)

const positioning = useAnchorPositioning({
  anchor: () => (popover.mounted.value ? anchorElement.value : null),
  floating: () => (popover.mounted.value ? element.value : null),
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
  disableAnchorTracking: () => disableAnchorTracking,
  adaptiveOrigin: popover.hasViewport
})

const animationsFinished = createAnimationsFinished({ element })

watchEffect(() => {
  const currentTrigger = popover.triggerElement.value
  const prev = prevTriggerElement

  if (currentTrigger) {
    prevTriggerElement = currentTrigger
  }

  if (prev && currentTrigger && currentTrigger !== prev) {
    popover.instantType.value = undefined
    const ac = new AbortController()
    animationsFinished.run(() => {
      popover.instantType.value = 'trigger-change'
    }, ac.signal)
    onWatcherCleanup(() => ac.abort())
  }
})

const modalNonHover = computed(
  () => popover.modal.value === true && popover.openChangeReason.value !== REASONS.triggerHover
)

useAnchoredPopupScrollLock({
  enabled: () => popover.open.value && modalNonHover.value,
  touchOpen: () => popover.openMethod.value === 'touch',
  positionerElement: element,
  referenceElement: popover.triggerElement
})

PopoverPositionerContext.set(positioning)

usePositionerStyle({
  element,
  styles: positioning.positionerStyles
})

const showBackdrop = computed(() => popover.mounted.value && modalNonHover.value)

const popoverState = computed<PopoverPositionerState>(() => ({
  open: popover.open.value,
  side: positioning.side.value,
  align: positioning.align.value,
  anchorHidden: positioning.anchorHidden.value,
  instant: popover.instantType.value
}))

const stateAttrs = computed(() => anchoredPositionerAttrs(popoverState.value))

const ownAttrs = computed(() => ({
  hidden: !popover.mounted.value,
  role: 'presentation'
}))

const positionerStyle = computed(() => ({
  ...(popover.transitionStatus.value === 'starting' ? { transition: 'none' } : undefined),
  ...(popover.open.value ? undefined : { pointerEvents: 'none' })
}))
</script>

<template>
  <InternalBackdrop
    v-if="showBackdrop"
    :inert="popover.open.value ? undefined : true"
    :cutout="popover.triggerElement.value"
  />
  <component
    :is="as"
    ref="element"
    v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)"
    :style="positionerStyle"
  >
    <slot v-bind="popoverState" />
  </component>
</template>
